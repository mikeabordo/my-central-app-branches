<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Stock Request</h4>
            <h6>Manage and track inventory replenishment requests.</h6>
          </div>
          <div class="page-btn">
            <button
              type="button"
              class="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-stock-request"
            >
              <vue-feather type="plus-circle" class="me-2"></vue-feather>New Stock Request
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <DynamicDataTable
                  :headers="headers"
                  :items="items"
                  :loading="loading"
                  searchPlaceholder="Search requests by ID, book, or requester..."
                >
                  <!-- Custom slot for Status -->
                  <template #item-status="item">
                    <span :class="['badge', getStatusClass(item.status)]">
                      {{ item.status }}
                    </span>
                  </template>

                  <!-- Custom slot for actions -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <button
                        class="btn btn-sm btn-outline-dark"
                        title="View"
                        data-bs-toggle="modal"
                        data-bs-target="#view-stock-request"
                        @click="viewRequest(item)"
                      >
                        <vue-feather type="eye" size="14"></vue-feather>
                      </button>
                      <button
                        class="btn btn-sm btn-outline-warning"
                        title="Edit"
                        data-bs-toggle="modal"
                        data-bs-target="#edit-stock-request"
                        @click="editRequest(item)"
                      >
                        <vue-feather type="edit" size="14"></vue-feather>
                      </button>
                    </div>
                  </template>
                </DynamicDataTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- View Modal -->
  <view-item-table
    :modalId="'view-stock-request'"
    :title="'View Stock Request'"
    :item="selectedRequest"
    :size="'xl'"
    :summaryFields="summaryFields"
    :columns="viewColumns"
    :tableItems="viewTableItems"
  />

  <!-- Add Modal -->
  <add-modal
    :modalId="'add-stock-request'"
    :title="'Add Stock Request'"
    :submitLabel="'Submit'"
    :size="'lg'"
    :fields="fields"
    @create="submitStockRequest"
  />

  <!-- Edit Modal -->
  <edit-modal
    :modalId="'edit-stock-request'"
    :title="'Edit Stock Request'"
    :item="selectedRequest"
    :size="'lg'"
    :fields="editFields"
    @update="submitEditRequest"
  />

</template>

<script>
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import AddModal from "@/components/modal/add-modal.vue";
import EditModal from "@/components/action-modal/edit-modal.vue";
import ViewItemTable from "@/components/action-modal/view-item-table.vue";
import api from "@/services/api";

export default {
  name: "StockRequest",
  components: {
    DynamicDataTable,
    AddModal,
    EditModal,
    ViewItemTable,
  },
  data() {
    return {
      items: [],
      loading: false,
      nextRSNo: "",
      selectedRequest: null,
      headers: [
        { text: "#", value: "id", sortable: true },
        { text: "ID", value: "RSNo", sortable: true },
        { text: "Branch", value: "toBranch", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Date", value: "createdAt", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "RSNo",
          label: "Reference #",
          type: "text",
          required: true,
          disabled: true,
          value: this.nextRSNo,
        },
        {
          key: "remarks",
          label: "Remarks",
          type: "textarea",
          placeholder: "Enter remarks",
          required: true,
          rows: 5,
        },
        {
          key: "product",
          label: "Product",
          type: "text",
          required: true,
          placeholder: "Enter product code or title",
        },
      ];
    },
      

    editFields() {
      return [
        {
          key: "RSNo",
          label: "Reference #",
          type: "text",
          disabled: true,
        },
        {
          key: "remarks",
          label: "Remarks",
          type: "textarea",
          placeholder: "Enter remarks",
          required: true,
          rows: 5,
        },
        {
          key: "product",
          label: "Product",
          type: "text",
          required: true,
          placeholder: "Enter product code or title",
        },
      ];
    },

    summaryFields() {
      return [
        { key: "RSNo", label: "Reference #" },
        { key: "toBranch", label: "Branch" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Date" },
        { key: "remarks", label: "Remarks" },
      ];
    },

    viewColumns() {
      return [
        { label: "#", key: "index", width: "50px" },
        { label: "Item Key", key: "itemKey" },
        { label: "Book Details", key: "bookDetails" },
        { label: "Qty", key: "qty", width: "80px" },
        { label: "Fulfilled", key: "fulfilled", width: "80px" },
        { label: "Action", key: "action", width: "80px" },
      ];
    },

    viewTableItems() {
      if (!this.selectedRequest || !this.selectedRequest.items) return [];
      return this.selectedRequest.items.map((item, i) => ({
        index: i + 1,
        ...item,
      }));
    },
  },
  created() {
    this.getStockRequests();
    this.getNextRSNo();
  },
  methods: {

    async getStockRequests() {
      this.loading = true;
      try {
        const responseData = await api.get("/branches/stock-request/list");
        let fetchedStockRequests = responseData.data || responseData || [];
        this.items = Array.isArray(fetchedStockRequests) ? fetchedStockRequests : [];
        console.log("Stock requests fetched:", this.items);
      } catch (error) {
        console.error("Failed to fetch stock requests:", error);
      } finally {
        this.loading = false;
      }
    },

    async getNextRSNo() {
      try {
        const responseData = await api.get("/branches/next-rsno");
        console.log("[next-rsno RAW response]:", JSON.stringify(responseData));
        this.nextRSNo =
          responseData?.RSNo ||
          responseData?.data?.RSNo ||
          responseData?.nextRSNo ||
          responseData?.data?.nextRSNo ||
          responseData?.data ||
          "";
        console.log("Next RSNo fetched:", this.nextRSNo);
      } catch (error) {
        console.error("Failed to fetch next RSNo:", error);
      }
    },

    getStatusClass(status) {
      switch (status) {
        case "Approved":
          return "bg-success-light";
        case "Rejected":
          return "bg-danger-light";
        default:
          return "bg-warning-light";
      }
    },

    editRequest(request) {
      this.selectedRequest = { ...request };
      console.log("Editing request:", this.selectedRequest);
    },

    viewRequest(request) {
      this.selectedRequest = { ...request };
      console.log("Viewing request:", this.selectedRequest);
    },

    async submitStockRequest(formData) {
      try {
        console.log("Submitting stock request:", formData);
        const response = await api.post("/branches/stock-request/add", formData);
        console.log("Stock request submitted successfully:", response);
        await this.getStockRequests();
        await this.getNextRSNo();
      } catch (error) {
        console.error("Stock request submission failed:", error.message);
        console.error("Status:", error.status);
        console.error("Backend response:", JSON.stringify(error.data));
      }
    },

    async submitEditRequest(formData) {
      try {
        console.log("Updating stock request:", formData);
        const response = await api.put("/branches/stock-request/update", formData);
        console.log("Stock request updated successfully:", response);
        await this.getStockRequests();
        this.selectedRequest = null;
      } catch (error) {
        console.error("Stock request update failed:", error.message);
        console.error("Status:", error.status);
        console.error("Backend response:", JSON.stringify(error.data));
      }
    },
  },
};
</script>

<style scoped>
.bg-danger-light {
  background-color: #ffe5e5;
  color: #ff4d4d;
}
.bg-success-light {
  background-color: #e5f9e5;
  color: #28c76f;
}
.bg-warning-light {
  background-color: #fff4e5;
  color: #ff9f43;
}
.badge {
  padding: 0.5em 0.8em;
  font-weight: 500;
  border-radius: 4px;
}
.table-actions .btn {
  padding: 0.25rem 0.5rem;
}
</style>
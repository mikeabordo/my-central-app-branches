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
                      <button class="btn btn-sm btn-outline-dark" title="View" @click="approveRequest(item)">
                        View
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
  <add-modal
    :modalId="'add-stock-request'"
    :title="'Add Stock Request'"
    :submitLabel="'Submit'"
    :size="'lg'"
    :fields="fields"
    :apiEndpoint="'/branches/stock-request'"
    :apiMethod="'post'"
    :successMessage="'Stock request added successfully!'"
    :errorMessage="'Failed to add stock request'"
    @success="handleSuccess"
    @error="handleError"
  />

</template>

<script>
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import AddModal from "@/components/modal/add-modal.vue";
import api from "@/services/api";

export default {
  name: "StockRequest",
  components: {
    DynamicDataTable,
    AddModal,
  },
  data() {
    return {
      items: [],
      loading: false,
      headers: [
        { text: "#", value: "id", sortable: true },
        { text: "ID", value: "RSNo", sortable: true },
        { text: "Branch", value: "toBranch", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Date", value: "createdAt", sortable: true },
        { text: "Remarks", value: "remarks", sortable: true },
        { text: "Actions", value: "actions" },
      ],
      fields: [
        {
          key: "RSNo",
          label: "Reference #",
          type: "text",
          required: true,
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
          type: "search",
          required: true,
          placeholder: "Search product code or title",
          apiEndpoint: "/products/search",
          apiMethod: "get",
          apiParams: {
            search: "",
          },
          apiHeaders: {
            "Content-Type": "application/json",
          },
          apiBody: {},
          apiSuccess: (response) => {
            return response.data;
          },
          apiError: (error) => {
            return error.response.data;
          },
        },
      ],
    };
  },
  created() {
    this.getStockRequests();
  },
  methods: {

    async getStockRequests() {
      this.loading = true;
      try {
        const responseData = await api.get("/branches/stock-request/list");
        // Ensure we always assign an Array to this.warehouses to prevent rendering crashes
        let fetchedStockRequests = responseData.data || responseData || [];
        this.items = Array.isArray(fetchedStockRequests) ? fetchedStockRequests : [];
        console.log("Stock requests fetched:", this.items);
      } catch (error) {
        console.error("Failed to fetch stock requests:", error);
      } finally {
        this.loading = false;
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
    approveRequest(request) {
      console.log("Approving request:", request);
    },
    rejectRequest(request) {
      console.log("Rejecting request:", request);
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
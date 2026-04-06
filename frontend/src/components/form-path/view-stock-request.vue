<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div class="page-title">
            <h3 class="fw-bold mb-1">Stock Request Details</h3>
            <p class="text-muted small mb-0">View complete details of this inventory replenishment request.</p>
          </div>
          <div class="page-btn">
            <button type="button" class="btn btn-added btn-dark" @click="$router.push('/inventory/stock-request')">
              <vue-feather type="arrow-left" size="14" class="me-2"></vue-feather>
              {{ backButtonText }}
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <view-item-table v-else :item="selectedRequest" :summary-fields="summaryFields" :columns="viewColumns"
              :table-items="viewTableItems">
              <!-- Slot support for removing items if needed -->
              <template #col-action="row">
                <button class="btn btn-sm btn-outline-danger" title="Remove Item" @click="removeItemDetail(row)">
                  <vue-feather type="trash-2" size="14"></vue-feather>
                </button>
              </template>
            </view-item-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewItemTable from "@/components/form/view-item-table.vue";
import api from "@/services/api";

export default {
  name: "ViewStockRequest",
  components: {
    ViewItemTable,
  },
  data() {
    return {
      selectedRequest: null,
      loading: false,
      backButtonText: "Back to Stock Request List",
    };
  },
  computed: {
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
        { label: "#", key: "id", width: "50px" },
        { label: "Item Key", key: "itemKey" },
        { label: "Book Details", key: "bookDetails" },
        { label: "Qty", key: "qty", width: "80px" },
        { label: "Fulfilled", key: "fulfilled", width: "80px" },
        { label: "Action", key: "action", width: "80px" },
      ];
    },
    viewTableItems() {
      if (!this.selectedRequest || !this.selectedRequest.items) {
        // Return some mock data if empty (as per original code pattern)
        return [
          { id: "1", itemKey: "ITM-001", bookDetails: "Javascript Patterns", qty: "10", fulfilled: "5" },
          { id: "2", itemKey: "ITM-002", bookDetails: "Eloquent JavaScript", qty: "20", fulfilled: "10" }
        ];
      }
      return this.selectedRequest.items.map((item, i) => ({ id: i + 1, ...item }));
    },
  },
  created() {
    this.fetchRequest();
  },
  methods: {
    async fetchRequest() {
      const id = this.$route.params.id;
      if (!id) return;

      this.loading = true;
      try {
        const responseData = await api.get("/branches/stock-request/list");
        const listTemp = responseData?.data || responseData || [];
        const list = Array.isArray(listTemp) ? listTemp : [];

        const found = list.find((item) => String(item.id) === String(id));
        this.selectedRequest = found || {};
      } catch (error) {
        console.error("Failed to fetch stock request details:", error);
        this.selectedRequest = {};
      } finally {
        this.loading = false;
      }
    },
    removeItemDetail(item) {
      console.log("Removing item in view table:", item);
      // Implementation logic...
    },
  },
};
</script>

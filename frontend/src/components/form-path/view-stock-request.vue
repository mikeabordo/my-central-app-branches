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
              <!-- Item Key Slot -->
              <template #col-itemKey="row">
                <span class="text-secondary fw-bold">{{ row.booktype }}:</span>{{ row.bookitemkey || row.itemKey
                }}
              </template>

              <!-- Product Details Slot -->
              <template #col-book_details="row">
                <div class="d-flex flex-column gap-1">
                  <span class="fw-bold text-dark fs-6">{{ row.title || row.bookDetails || '—' }}</span>
                  <div class="text-secondary small d-flex flex-column">
                    <span v-if="row.author">Author: {{ row.author }}</span>
                    <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                    <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                  </div>
                </div>
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
        { label: "Item Key", key: "itemKey", width: "20%" },
        { label: "Book Details", key: "book_details" },
        { label: "Qty", key: "qty", width: "80px" },
        { label: "Fulfilled", key: "fulfilled", width: "80px" },
        { label: "Action", key: "action", width: "80px" },
      ];
    },
    viewTableItems() {
      if (!this.selectedRequest || !this.selectedRequest.items) {
        return [];
      }
      return this.selectedRequest.items.map((item, i) => ({
        id: i + 1,
        ...item,
        // Mapping from the real API response structure
        itemKey: item.bookitemkey || item.itemKey || item.bookRef || "",
        bookDetails: item.title || item.bookDetails || item.bookTitle || "",
        qty: item.qtyRequested || item.qty || 0,
        fulfilled: item.qtyDelivered || item.fulfilled || item.qtyFulfilled || 0,
      }));
    },
  },
  created() {
    this.fetchRequest();
  },
  methods: {
    async fetchRequest() {
      const id = this.$route.params.RSNo; // Could be RSNo or internal ID
      if (!id) return;

      this.loading = true;
      try {
        // Calling the items endpoint as per documentation
        // The user mentioned they will modify the endpoint if needed
        const response = await api.get(`/branches/rs/items?rsNo=${id}`);

        // Handle various response structures (info/lines vs flat object vs array)
        if (response && response.status === 200) {
          this.selectedRequest = {
            ...response.info,
            items: response.lines || response.items || []
          };
        } else {
          // Fallback: if response is an array of objects
          const data = Array.isArray(response) ? response[0] : (response?.data || response);
          this.selectedRequest = {
            ...(data || {}),
            items: data?.items || data?.lines || []
          };
        }
        console.log("Selected Request:", this.selectedRequest);
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

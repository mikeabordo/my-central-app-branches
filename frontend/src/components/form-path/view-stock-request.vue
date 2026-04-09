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
              Back to Stock Request List
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

            <template v-else>
              <view-item-table
                :item="selectedRequest || {}"
                :summary-fields="summaryFields"
                :columns="viewColumns"
                :table-items="viewTableItems"
              >
                <template #summary-remarks="item">
                  {{ item.remarks || '-' }}
                </template>

                <template #col-itemKey="row">
                  <span class="text-secondary fw-bold">{{ row.booktype }}:</span>{{ row.bookitemkey || row.itemKey }}
                </template>

                <template #col-book_details="row">
                  <div class="d-flex flex-column gap-1">
                    <span class="fw-bold text-dark fs-6">{{ row.title || row.bookDetails || '-' }}</span>
                    <div class="text-secondary small d-flex flex-column">
                      <span v-if="row.author">Author: {{ row.author }}</span>
                      <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                      <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                    </div>
                  </div>
                </template>

                <template #col-qty="row">
                  {{ row.qty }}
                </template>

                <template #col-fulfilled="row">
                  {{ row.fulfilled }}
                </template>
              </view-item-table>
            </template>
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
    };
  },
  computed: {
    summaryFields() {
      return [
        { key: "RSNo", label: "Reference No." },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Date" },
        { key: "remarks", label: "Remarks" },
      ];
    },
    viewColumns() {
      return [
        { label: "Item Key", key: "itemKey", width: "20%" },
        { label: "Book Details", key: "book_details" },
        { label: "Qty", key: "qty", width: "80px" },
        { label: "Fulfilled", key: "fulfilled", width: "80px" },
      ];
    },
    viewTableItems() {
      const source = this.selectedRequest;
      if (!source || !source.items) {
        return [];
      }

      return source.items.map((item, i) => ({
        id: i + 1,
        _idx: i,
        ...item,
        itemKey: item.bookitemkey || item.itemKey || item.bookRef || "",
        bookDetails: item.title || item.bookDetails || item.bookTitle || "",
        qty: item.qtyRequested ?? item.qty ?? 0,
        fulfilled: item.qtyDelivered || item.fulfilled || item.qtyFulfilled || 0,
      }));
    },
  },
  created() {
    this.fetchRequest();
  },
  methods: {
    async fetchRequest() {
      const id = this.$route.params.RSNo;
      if (!id) return;

      this.loading = true;
      try {
        const response = await api.get(`/branches/rs/items?rsNo=${id}`);
        const payload = response?.data ?? response ?? {};
        const data = payload?.info ?? payload?.data ?? payload;
        const items = payload?.lines ?? payload?.items ?? data?.items ?? [];

        this.selectedRequest = {
          ...(data || {}),
          items: Array.isArray(items) ? items : [],
        };
      } catch (error) {
        console.error("Failed to fetch stock request details:", error);
        this.selectedRequest = {};
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>

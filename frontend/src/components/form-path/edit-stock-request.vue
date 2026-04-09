<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div class="page-title">
            <h3 class="fw-bold mb-1">Edit Stock Request</h3>
            <p class="text-muted small mb-0">Update the request details, quantities, and line items.</p>
          </div>
          <div class="page-btn d-flex gap-2">
            <button type="button" class="btn btn-submit btn-gradient warm" @click="handleUpdate" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Save Changes
            </button>
            <button type="button" class="btn btn-cancel" @click="cancelEdit" :disabled="loading">
              Cancel
            </button>
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
              <div class="card shadow-sm border-0 mb-4 search-card">
                <div class="card-body">
                  <label class="form-label fw-bold text-dark d-flex align-items-center">
                    <vue-feather type="plus-circle" size="16" class="me-2 text-primary"></vue-feather>
                    Add New Book to Request
                  </label>
                  <div class="search-field-wrapper position-relative" v-click-outside="closeDropdown">
                    <div class="input-group">
                      <span class="input-group-text bg-white border-end-0">
                        <vue-feather type="search" size="16" class="text-muted"></vue-feather>
                      </span>
                      <input
                        type="text"
                        class="form-control border-start-0 ps-0"
                        v-model="searchQuery"
                        placeholder="Search by Title, Author, or ISBN..."
                        @input="onSearchInput"
                        @keydown.escape="closeDropdown"
                      />
                    </div>

                    <div v-if="searchLoading" class="search-spinner">
                      <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
                    </div>

                    <div v-if="searchResults.length" class="search-results-dropdown shadow-lg border rounded mt-1">
                      <ul class="list-unstyled mb-0">
                        <li
                          v-for="result in searchResults"
                          :key="result._key || result.id"
                          class="search-result-item p-3 border-bottom"
                          @click="selectSearchResult(result)"
                        >
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="book-result-item">
                              <div class="book-result-primary">
                                <span class="book-type-badge" v-if="result.booktype">{{ result.booktype }}</span>
                                <span class="book-item-key fw-bold text-dark">{{ result.bookitemkey }}</span>
                              </div>
                              <div class="book-result-secondary text-muted small">
                                <span class="fw-bold text-dark">{{ result.title }}</span><br />
                                <span class="small">{{ result.ISBN }} {{ result.bookedition }}</span>
                              </div>
                            </div>
                            <vue-feather type="plus" size="18" class="text-primary"></vue-feather>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div v-if="searchNoResult" class="text-danger small mt-2 ps-1">
                      No books found matching "{{ searchQuery }}"
                    </div>
                  </div>
                </div>
              </div>

              <edit-item-table
                :item="editableRequest || {}"
                :summary-fields="summaryFields"
                :columns="viewColumns"
                :table-items="viewTableItems"
              >
                <template #summary-remarks="item">
                  <textarea
                    v-model="editableRequest.remarks"
                    class="form-control border-0 p-0 shadow-none"
                    style="background: transparent; resize: none; font-weight: 600; font-size: 1.1rem;"
                    rows="1"
                    placeholder="Enter remarks..."
                  ></textarea>
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
                  <input
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 80px;"
                    min="1"
                    :value="getItemQty(row)"
                    @input="setItemQty(row, $event)"
                  >
                </template>

                <template #col-fulfilled="row">
                  {{ row.fulfilled }}
                </template>

                <template #col-action="row">
                  <div class="text-center">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger border-0"
                      @click="removeSelectedItem(row)"
                    >
                      <vue-feather type="trash-2" size="16"></vue-feather>
                    </button>
                  </div>
                </template>
              </edit-item-table>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditItemTable from "@/components/form/edit-item-table.vue";
import api from "@/services/api";

export default {
  name: "EditStockRequest",
  components: {
    EditItemTable,
  },
  data() {
    return {
      selectedRequest: null,
      editableRequest: null,
      loading: false,

      searchQuery: "",
      searchResults: [],
      searchLoading: false,
      searchNoResult: false,
      _debounceTimer: null,
    };
  },
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value();
          }
        };
        document.addEventListener('click', el.clickOutsideEvent);
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent);
      },
    },
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
        { label: "Action", key: "action", width: "80px" },
      ];
    },
    viewTableItems() {
      const source = this.editableRequest;
      if (!source || !source.items) {
        return [];
      }

      return source.items.map((item, i) => ({
        id: i + 1,
        _idx: i,
        ...item,
        itemKey: item.bookitemkey || item.itemKey || item.bookRef || "",
        bookDetails: item.title || item.bookDetails || item.bookTitle || "",
        qty: item._editedQty ?? item.qtyRequested ?? item.qty ?? 0,
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
        this.editableRequest = JSON.parse(JSON.stringify(this.selectedRequest || {}));
      } catch (error) {
        console.error("Failed to fetch stock request details:", error);
        this.selectedRequest = {};
        this.editableRequest = {};
      } finally {
        this.loading = false;
      }
    },
    async handleUpdate() {
      this.loading = true;
      try {
        const payload = {
          rsNo: this.editableRequest.RSNo,
          remarks: this.editableRequest.remarks,
          items: (this.editableRequest.items || []).map((it) => {
            const rawId = it.bookId ?? it._bookId;
            return {
              bookId: parseInt(rawId, 10) || rawId,
              qty: it._editedQty ?? it.qtyRequested ?? it.qty ?? 0,
            };
          }),
        };

        const response = await api.post("/branches/rs/update", payload);
        if (response && response.status === 200) {
          await this.fetchRequest();
          this.$router.push({ name: "view-stock-request", params: { RSNo: this.editableRequest.RSNo } });
        } else {
          throw new Error("Update failed");
        }
      } catch (error) {
        console.error("Failed to update stock request:", error);
        alert("Failed to update stock request. Please check the console for details.");
      } finally {
        this.loading = false;
      }
    },
    cancelEdit() {
      const rsNo = this.editableRequest?.RSNo || this.$route.params.RSNo;
      if (rsNo) {
        this.$router.push({ name: "view-stock-request", params: { RSNo: rsNo } });
        return;
      }
      this.$router.push('/inventory/stock-request');
    },
    getItemQty(row) {
      const item = this.editableRequest?.items?.[row._idx];
      return item?._editedQty ?? item?.qtyRequested ?? item?.qty ?? 1;
    },
    setItemQty(row, event) {
      const val = parseInt(event.target.value, 10) || 1;
      const item = this.editableRequest?.items?.[row._idx];
      if (item) {
        item._editedQty = val;
        if (item.qtyRequested !== undefined) item.qtyRequested = val;
        else item.qty = val;
      }
    },
    onSearchInput() {
      this.searchNoResult = false;
      const query = this.searchQuery.trim();

      if (query.length < 2) {
        this.searchResults = [];
        return;
      }

      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => this.fetchSearchResults(query), 350);
    },
    async fetchSearchResults(query) {
      this.searchLoading = true;
      try {
        const response = await api.get(`/books/search?search=${encodeURIComponent(query)}&limit=10`);
        const raw = Array.isArray(response) ? response : (response.data || []);

        this.searchResults = raw.map(item => ({
          ...item,
          _key: item.bookitemkey || item.id,
        }));

        this.searchNoResult = this.searchResults.length === 0;
      } catch (err) {
        console.error("Search error:", err);
        this.searchNoResult = true;
      } finally {
        this.searchLoading = false;
      }
    },
    selectSearchResult(result) {
      if (!this.editableRequest.items) {
        this.editableRequest.items = [];
      }

      const isDup = this.editableRequest.items.some(it =>
        (it.bookitemkey && it.bookitemkey === result.bookitemkey) ||
        (it.id && it.id === result.id)
      );

      if (!isDup) {
        this.editableRequest.items.push({
          ...result,
          bookitemkey: result.bookitemkey,
          _bookId: parseInt(result.id, 10) || result.id,
          qtyRequested: 1,
          _editedQty: 1,
          qtyDelivered: 0,
        });
      }

      this.closeDropdown();
    },
    removeSelectedItem(row) {
      if (this.editableRequest && this.editableRequest.items) {
        this.editableRequest.items.splice(row._idx, 1);
      }
    },
    closeDropdown() {
      this.searchResults = [];
      this.searchQuery = "";
      this.searchNoResult = false;
    },
  },
};
</script>

<style scoped>
.search-card {
  border: 1px dashed #FF9F43;
  background-color: rgba(255, 159, 67, 0.02);
}

.search-field-wrapper {
  position: relative;
}

.search-spinner {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  background: #fff;
  z-index: 1050;
  margin-top: -10px;
}

.search-result-item {
  cursor: pointer;
  transition: background 0.2s;
}

.search-result-item:hover {
  background: #f8fafc;
}

.search-result-item:last-child {
  border-bottom: none !important;
}

.result-details {
  flex: 1;
}
</style>

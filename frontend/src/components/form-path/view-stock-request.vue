<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div class="page-title">
            <h3 class="fw-bold mb-1">Stock Request Details</h3>
            <p v-if="!isEditing" class="text-muted small mb-0">View complete details of this inventory replenishment
              request.</p>
            <p v-else class="text-primary small mb-0 fw-bold">
              <vue-feather type="edit-3" size="12" class="me-1"></vue-feather>
              You are currently editing this stock request.
            </p>
          </div>
          <div class="page-btn d-flex gap-2">
            <button v-if="!isEditing" type="button" class="btn btn-primary" @click="toggleEdit">
              <vue-feather type="edit" size="14" class="me-2"></vue-feather>
              Edit Request
            </button>
            <template v-else>
              <button type="button" class="btn btn-submit btn-gradient warm" @click="handleUpdate" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Save Changes
              </button>
              <button type="button" class="btn btn-cancel" @click="isEditing = false" :disabled="loading">
                Cancel
              </button>
            </template>

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

            <template v-else>
              <!-- Add New Book Search (Only in Edit Mode) -->
              <div v-if="isEditing" class="card shadow-sm border-0 mb-4 search-card">
                <div class="card-body">
                  <label class="form-label fw-bold text-dark d-flex align-items-center">
                    <vue-feather type="plus-circle" size="16" class="me-2 text-primary"></vue-feather>
                    Add New Book to Request
                  </label>
                  <!-- Search Field -->
                  <div class="search-field-wrapper position-relative" v-click-outside="closeDropdown">
                    <div class="input-group">
                      <span class="input-group-text bg-white border-end-0">
                        <vue-feather type="search" size="16" class="text-muted"></vue-feather>
                      </span>
                      <input type="text" class="form-control border-start-0 ps-0" v-model="searchQuery"
                        placeholder="Search by Title, Author, or ISBN..." @input="onSearchInput"
                        @keydown.escape="closeDropdown" />
                    </div>

                    <!-- Loading spinner -->
                    <div v-if="searchLoading" class="search-spinner">
                      <span class="spinner-border spinner-border-sm text-primary" role="status"></span>
                    </div>

                    <!-- Results Dropdown -->
                    <div v-if="searchResults.length" class="search-results-dropdown shadow-lg border rounded mt-1">
                      <ul class="list-unstyled mb-0">
                        <li v-for="result in searchResults" :key="result._key || result.id"
                          class="search-result-item p-3 border-bottom" @click="selectSearchResult(result)">
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

                    <!-- No results state -->
                    <div v-if="searchNoResult" class="text-danger small mt-2 ps-1">
                      No books found matching "{{ searchQuery }}"
                    </div>
                  </div>
                </div>
              </div>

              <view-item-table :item="isEditing ? (editableRequest || {}) : (selectedRequest || {})"
                :summary-fields="summaryFields" :columns="viewColumns" :table-items="viewTableItems">

                <!-- Remarks Summary Slot (Editable) -->
                <template #summary-remarks="item">
                  <textarea v-if="isEditing" v-model="editableRequest.remarks" class="form-control border-0 p-0 shadow-none"
                    style="background: transparent; resize: none; font-weight: 600; font-size: 1.1rem;" rows="1"
                    placeholder="Enter remarks..."></textarea>
                  <template v-else>
                    {{ item.remarks || '—' }}
                  </template>
                </template>

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

                <!-- Qty Slot (Editable in Edit Mode) -->
                <template #col-qty="row">
                  <input
                    v-if="isEditing"
                    type="number"
                    class="form-control form-control-sm"
                    style="width: 80px;"
                    min="1"
                    :value="getItemQty(row)"
                    @input="setItemQty(row, $event)"
                  >
                  <span v-else>{{ row.qty }}</span>
                </template>

                <!-- Action Column Slot (Editable in Edit Mode) -->
                <template #col-action="row">
                  <div v-if="isEditing" class="text-center">
                    <button type="button" class="btn btn-sm btn-outline-danger border-0"
                      @click="removeSelectedItem(row)">
                      <vue-feather type="trash-2" size="16"></vue-feather>
                    </button>
                  </div>
                  <span v-else class="text-muted">—</span>
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
      editableRequest: null, // Temporary copy for editing
      loading: false,
      isEditing: false,
      backButtonText: "Back to Stock Request List",

      // Search State for adding new books
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
      const source = this.isEditing ? this.editableRequest : this.selectedRequest;
      if (!source || !source.items) {
        return [];
      }
      return source.items.map((item, i) => ({
        id: i + 1,
        _idx: i,          // stable array index for direct reads/writes
        ...item,
        // Mapping from the real API response structure
        itemKey: item.bookitemkey || item.itemKey || item.bookRef || "",
        bookDetails: item.title || item.bookDetails || item.bookTitle || "",
        // Use _editedQty as the source of truth if the user already edited it
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
    toggleEdit() {
      if (!this.isEditing) {
        // Clone for editing
        this.editableRequest = JSON.parse(JSON.stringify(this.selectedRequest));
      }
      this.isEditing = !this.isEditing;
    },
    async handleUpdate() {
      this.loading = true;
      try {
        // Prepare the payload as expected by /branches/rs/update
        const payload = {
          rsNo: this.editableRequest.RSNo,
          remarks: this.editableRequest.remarks,
          items: this.editableRequest.items.map(it => {
            // Backend expects a numeric bookId (integer)
            // _bookId is explicitly stored when adding from search
            // it.id on DB items is the line ID (not the book ID) — use _bookId or bookid
            const rawId = it._bookId ?? it.bookid ?? it.id ?? it.bookitemkey;
            return {
              bookId: parseInt(rawId, 10) || rawId,
              qty: it._editedQty ?? it.qtyRequested ?? it.qty ?? 0
            };
          })
        };

        console.log("Updating stock request with payload:", payload);
        const response = await api.post(`/branches/rs/update`, payload);

        if (response && response.status === 200) {
          // Refresh the data from server to ensure sync
          await this.fetchRequest();
          this.isEditing = false;
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
    // Read qty directly from the source array (not the computed copy)
    getItemQty(row) {
      const item = this.editableRequest?.items?.[row._idx];
      return item?._editedQty ?? item?.qtyRequested ?? item?.qty ?? 1;
    },
    // Write qty directly to the source array — survives computed re-renders
    setItemQty(row, event) {
      const val = parseInt(event.target.value, 10) || 1;
      const item = this.editableRequest?.items?.[row._idx];
      if (item) {
        item._editedQty = val;
        if (item.qtyRequested !== undefined) item.qtyRequested = val;
        else item.qty = val;
      }
    },

    // ── Search & Add Methods (Inline Edit) ──
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
        // Using generic books search API
        const response = await api.get(`/books/search?search=${encodeURIComponent(query)}&limit=10`);
        const raw = Array.isArray(response) ? response : (response.data || []);

        this.searchResults = raw.map(item => ({
          ...item,
          // Preserve original numeric id — use bookitemkey only as the v-for key
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

      // Check for duplicates
      const isDup = this.editableRequest.items.some(it =>
        (it.bookitemkey && it.bookitemkey === result.bookitemkey) ||
        (it.id && it.id === result.id)
      );

      if (!isDup) {
        // Add as a new line item — store _bookId to preserve the numeric book ID
        this.editableRequest.items.push({
          ...result,
          bookitemkey: result.bookitemkey,
          _bookId: parseInt(result.id, 10) || result.id, // numeric book ID for payload
          qtyRequested: 1,
          _editedQty: 1,
          qtyDelivered: 0,
        });
      }

      this.closeDropdown();
    },

    removeSelectedItem(row) {
      if (this.editableRequest && this.editableRequest.items) {
        // Use the stable _idx to remove the correct item
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


/* ── Search results dropdown ── */
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

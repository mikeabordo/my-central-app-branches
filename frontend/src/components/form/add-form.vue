<template>
  <form @submit.prevent="handleSubmit">
    <div class="card shadow-sm border-0">
      <div class="card-body pt-3">
        <div class="row">
          <div v-for="field in fields" :key="field.key" :class="['mb-3', 'field-wrapper', colClass(field)]">
            <label class="form-label">{{ field.label }}</label>

            <!-- ── API Search field ── -->
            <div v-if="isSearch(field)" class="search-field-wrapper" v-click-outside="() => closeDropdown(field.key)">
              <div class="position-relative" style="z-index: 1051;">
                <input type="text" class="form-control mb-3" v-model="searchQueries[field.key]"
                  :placeholder="field.placeholder || `Search ${field.label}…`" @input="onSearchInput(field, $event)"
                  @keydown.escape="closeDropdown(field.key)" autocomplete="off" />
                <!-- Loading spinner inside input -->
                <div v-if="searchLoading[field.key]" class="search-spinner" style="top: 20px;">
                  <span class="spinner-border spinner-border-sm text-secondary" role="status"></span>
                </div>

                <!-- Results Dropdown -->
                <div v-if="searchResults[field.key] && searchResults[field.key].length"
                  class="search-results-dropdown shadow-lg border rounded">
                  <ul class="list-unstyled mb-0">
                    <li v-for="result in searchResults[field.key]" :key="getOptionValue(result)"
                      class="search-result-item p-2 border-bottom" @click="selectSearchResult(field, result)">
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="result-details">
                          <slot name="dropdown-result" v-bind="result._raw">
                            <slot name="col-product_details" v-bind="result._raw">
                              <span class="fw-bold">{{ getOptionLabel(result) }}</span>
                            </slot>
                          </slot>
                        </div>
                        <vue-feather type="plus-circle" size="16" class="text-primary"></vue-feather>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- No results state (inline) -->
              <div v-if="searchNoResult[field.key]" class="text-danger small mb-2">
                No results found
              </div>

              <!-- Selected Items Table -->
              <div v-if="selectedItems[field.key] && selectedItems[field.key].length"
                class="table-responsive border rounded mt-2">
                <table class="table table-hover mb-0">
                  <thead class="bg-light">
                    <tr>
                      <th v-for="col in (field.tableColumns || [{ label: 'Result', key: 'label' }])" :key="col.key">
                        {{ col.label }}
                      </th>
                      <th style="width: 80px;" class="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in selectedItems[field.key]" :key="idx">
                      <td v-for="col in (field.tableColumns || [{ label: 'Result', key: 'label' }])" :key="col.key">
                        <template v-if="col.editable || col.key === 'qty'">
                          <input type="number" v-model.number="item[col.key]" class="form-control form-control-sm"
                            style="width: 80px;" min="1" @input="updateFormData(field)">
                        </template>
                        <slot v-else :name="'col-' + col.key" v-bind="item._raw">
                          {{ col.key === 'label' ? item.label : (item._raw && item._raw[col.key]) }}
                        </slot>
                      </td>
                      <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-danger border-0"
                          @click="removeSelectedItem(field, idx)">
                          <vue-feather type="trash-2" size="16"></vue-feather>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ── Dropdown / Select field ── -->
            <select v-else-if="isDropdown(field)" class="form-select form-control" v-model="formData[field.key]"
              :disabled="field.disabled || false" :class="{ 'bg-light': field.disabled }">
              <option value="" disabled>
                {{ field.placeholder || `Select ${field.label}` }}
              </option>
              <option v-for="opt in field.options" :key="getOptionValue(opt)" :value="getOptionValue(opt)">
                {{ getOptionLabel(opt) }}
              </option>
            </select>

            <!-- ── Textarea field ── -->
            <textarea v-else-if="isTextarea(field)" class="form-control" v-model="formData[field.key]"
              :rows="field.rows || 3" :disabled="field.disabled || false" :class="{ 'bg-light': field.disabled }"
              :placeholder="field.placeholder || ''"></textarea>

            <!-- ── Plain input ── -->
            <input v-else :type="field.type || 'text'" class="form-control" v-model="formData[field.key]"
              :disabled="field.disabled || false" :class="{ 'bg-light': field.disabled }"
              :placeholder="field.placeholder || ''" />
          </div>
        </div><!-- end .row -->
      </div>
    </div>

    <div class="d-flex justify-content-end mb-5">
      <button type="submit" class="btn btn-submit btn-gradient warm">
        {{ submitLabel }}
      </button>
    </div>
  </form>
</template>

<script>
import api from "@/services/api";

export default {
  name: "AddForm",
  props: {
    title: { type: String, default: "Add New" },
    submitLabel: { type: String, default: "Submit" },
    fields: { type: Array, default: () => [] },
  },

  emits: ["create", "cancel"],

  data() {
    return {
      formData: {},
      searchQueries: {},
      searchResults: {},
      searchLoading: {},
      searchNoResult: {},
      selectedItems: {}, // Track selected items for search fields
      _debounceTimers: {},
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

  watch: {
    fields: {
      handler(newFields) {
        this.initFormData(newFields);
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    isDropdown(field) {
      return field.type === "select" || field.type === "dropdown";
    },
    isSearch(field) {
      return field.type === "search";
    },
    isTextarea(field) {
      return field.type === "textarea";
    },
    getOptionValue(opt) {
      return typeof opt === "object" && opt !== null ? opt.value : opt;
    },
    getOptionLabel(opt) {
      return typeof opt === "object" && opt !== null ? opt.label : opt;
    },
    colClass(field) {
      const n = field.col;
      if (!n || n === 12) return "col-12";
      return `col-12 col-md-${n}`;
    },
    initFormData(fields) {
      const fieldKeys = fields.map(f => f.key);

      // Remove stale keys from reactive objects (in-place mutation preserves reactivity)
      Object.keys(this.formData).forEach(k => {
        if (!fieldKeys.includes(k)) delete this.formData[k];
      });

      fields.forEach((f) => {
        // Only initialize if the key doesn't already have user-entered data
        if (this.formData[f.key] === undefined || this.formData[f.key] === "") {
          this.formData[f.key] = f.value !== undefined && f.value !== null ? f.value : "";
        }

        if (this.searchQueries[f.key] === undefined) {
          this.searchQueries[f.key] = "";
        }
        if (this.searchResults[f.key] === undefined) {
          this.searchResults[f.key] = [];
        }
        if (this.searchLoading[f.key] === undefined) {
          this.searchLoading[f.key] = false;
        }
        if (this.searchNoResult[f.key] === undefined) {
          this.searchNoResult[f.key] = false;
        }
        if (this.isSearch(f) && !this.selectedItems[f.key]) {
          this.selectedItems[f.key] = [];
        }
      });
    },

    onSearchInput(field, event) {
      const query = event.target.value;
      this.searchQueries[field.key] = query;

      // Only clear formData for single-selects. For lists, keep the existing items.
      if (!this.selectedItems[field.key] || this.selectedItems[field.key].length === 0) {
        this.formData[field.key] = "";
      }

      this.searchResults[field.key] = [];
      this.searchNoResult[field.key] = false;

      const minChars = field.minChars ?? 1;
      if (query.length < minChars) return;

      clearTimeout(this._debounceTimers[field.key]);
      this._debounceTimers[field.key] = setTimeout(
        () => this.fetchSearchResults(field, query),
        field.debounce ?? 350
      );
    },

    async fetchSearchResults(field, query) {
      this.searchLoading[field.key] = true;
      this.searchNoResult[field.key] = false;

      console.log(`[Search - ${field.key}] Initiating search...`);
      console.log(`[Search - ${field.key}] Endpoint:`, field.endpoint);
      console.log(`[Search - ${field.key}] Query:`, query);

      try {
        const method = (field.method || "get").toLowerCase();
        console.log(`[Search - ${field.key}] Method being used:`, method);
        let response;

        if (method === "post") {
          console.log(`[Search - ${field.key}] Request Payload:`, { search: query, limit: 10 });
          response = await api.post(field.endpoint, { search: query, limit: 10 });
        } else {
          const fullUrl = `${field.endpoint}?search=${encodeURIComponent(query)}&limit=10`;
          console.log(`[Search - ${field.key}] Request URL:`, fullUrl);
          response = await api.get(fullUrl);
        }

        console.log(`[Search - ${field.key}] Raw Response from Backend:`, response);

        const raw = Array.isArray(response)
          ? response
          : response.data ?? [];

        console.log(`[Search - ${field.key}] Extracted Array for Mapping:`, raw);

        const valueKey = field.valueKey ?? "id";
        const labelKey = field.labelKey ?? "name";

        this.searchResults[field.key] = raw.slice(0, 10).map((item) => ({
          value: item[valueKey],
          label: item[labelKey],
          _raw: item,
        }));

        console.log(`[Search - ${field.key}] Final Mapped Search Results:`, this.searchResults[field.key]);

        this.searchNoResult[field.key] = this.searchResults[field.key].length === 0;
      } catch (err) {
        console.error(`[Search - ${field.key}] Search Error:`, err);
        this.searchResults[field.key] = [];
        this.searchNoResult[field.key] = true;
      } finally {
        this.searchLoading[field.key] = false;
      }
    },

    selectSearchResult(field, result) {
      // Add to selected items instead of just setting value
      if (!this.selectedItems[field.key]) {
        this.selectedItems[field.key] = [];
      }

      // prevent duplicates safely (even if value is undefined)
      const isDup = this.selectedItems[field.key].some(item => {
        if (item.value && result.value) return item.value === result.value;
        if (item._raw && result._raw && item._raw.id) return item._raw.id === result._raw.id;
        return JSON.stringify(item._raw) === JSON.stringify(result._raw);
      });

      if (!isDup) {
        this.selectedItems[field.key] = [
          ...this.selectedItems[field.key],
          { ...result, qty: 1 }
        ];
      }

      this.updateFormData(field);

      this.searchQueries[field.key] = ""; // Clear search query after selection
      this.searchResults[field.key] = [];
      this.searchNoResult[field.key] = false;
    },

    removeSelectedItem(field, index) {
      this.selectedItems[field.key].splice(index, 1);
      this.updateFormData(field);
    },

    updateFormData(field) {
      this.formData[field.key] = this.selectedItems[field.key].map(item => {
        const updated = { ...item._raw, ...item };
        delete updated._raw;
        return updated;
      });
    },

    closeDropdown(key) {
      this.searchResults[key] = [];
    },

    handleSubmit() {
      this.$emit("create", { ...this.formData });
    },

    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.form-control,
.form-select {
  border-width: 1px;
  border-color: gray;
}

.form-control:focus,
.form-select:focus {
  border-width: 2px;
  border-color: #67748e;
}

/* ── Search field ── */
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

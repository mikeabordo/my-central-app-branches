<template>
  <div class="modal fade" :id="modalId">
    <div
      class="modal-dialog modal-dialog-centered custom-modal-two"
      :class="bsDialogClass"
      :style="customWidthStyle"
    >
      <div class="modal-content">
        <div class="page-wrapper-new p-0">
          <div class="content">
            <div class="modal-header border-0 custom-modal-header justify-content-between">
              <div class="page-title">
                <h4>{{ title }}</h4>
              </div>
              <button
                type="button"
                class="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body custom-modal-body">
              <!-- Summary info row (optional, shown when item exists) -->
              <div v-if="item && summaryFields.length" class="summary-row mb-3">
                <div class="row">
                  <div
                    v-for="field in summaryFields"
                    :key="field.key"
                    class="col-md"
                  >
                    <div class="summary-card">
                      <span class="summary-label">{{ field.label }}</span>
                      <span class="summary-value">{{ item[field.key] || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Data table -->
              <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th v-for="col in columns" :key="col.key" :style="col.width ? { width: col.width } : {}">
                        {{ col.label }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="!tableItems || tableItems.length === 0">
                      <td :colspan="columns.length" class="text-center text-muted py-4">
                        No items to display.
                      </td>
                    </tr>
                    <tr v-for="(row, index) in tableItems" :key="index">
                      <td v-for="col in columns" :key="col.key">
                        <!-- Slot support for custom column rendering -->
                        <slot :name="'col-' + col.key" v-bind="row">
                          {{ row[col.key] ?? '—' }}
                        </slot>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="modal-footer-btn mt-3">
                <button
                  type="button"
                  class="btn btn-cancel"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewItemTable",
  props: {
    /**
     * The Bootstrap modal ID (without the #).
     * Must match the data-bs-target used in the trigger button.
     */
    modalId: {
      type: String,
      required: true,
    },
    /**
     * The heading displayed inside the modal header.
     */
    title: {
      type: String,
      default: "View Details",
    },
    /**
     * The size of the modal: "sm" | "md" | "lg" | "xl" or a CSS width like "900px".
     */
    size: { type: String, default: "lg" },
    /**
     * The parent item object (e.g. the stock request).
     * Used to populate the optional summary row at the top.
     */
    item: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Optional summary fields displayed above the table.
     * Example: [{ label: "Reference #", key: "RSNo" }, { label: "Status", key: "status" }]
     */
    summaryFields: {
      type: Array,
      default: () => [],
    },
    /**
     * Column definitions for the table.
     * Each entry: { label: String, key: String, width?: String }
     * Example: [{ label: "#", key: "index", width: "50px" }, { label: "Product", key: "product" }]
     */
    columns: {
      type: Array,
      default: () => [],
    },
    /**
     * The array of row objects displayed in the table body.
     * Each object's keys should match the column `key` values.
     */
    tableItems: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    bsDialogClass() {
      const presets = { sm: "modal-sm", md: "", lg: "modal-lg", xl: "modal-xl" };
      return presets[this.size] || "";
    },
    customWidthStyle() {
      const presets = ["sm", "md", "lg", "xl", ""];
      return presets.includes(this.size) ? {} : { maxWidth: this.size };
    },
  },
};
</script>

<style scoped>
.summary-card {
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 4px;
}
.summary-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.summary-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #212529;
  margin-top: 2px;
}
.table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #495057;
  font-weight: 600;
}
.table td {
  font-size: 0.875rem;
  vertical-align: middle;
}
</style>

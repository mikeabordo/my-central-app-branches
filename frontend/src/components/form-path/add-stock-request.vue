<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header justify-content-between">
          <div class="page-title">
            <h4>Add Stock Request</h4>
            <h6>Create a new stock replenishment request</h6>
          </div>
          <div class="page-btn">
            <router-link to="/inventory/stock-request" class="btn btn-added btn-dark">
              <vue-feather type="arrow-left" class="me-2"></vue-feather>Back to Stock Request
            </router-link>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <add-form :submitLabel="'Submit Request'" :fields="fields" :summaryFields="summaryFields"
              @create="submitStockRequest" @cancel="$router.push('/inventory/stock-request')">

              <template #dropdown-result="row">
                <div class="book-result-item">
                  <div class="book-result-primary">
                    <span class="book-type-badge" v-if="row.booktype">{{ row.booktype }}</span>
                    <span class="book-item-key fw-bold">{{ row.bookitemkey }}</span>
                  </div>
                  <div class="book-result-secondary text-muted small">
                    {{ row.title || row.description || '—' }}
                  </div>
                </div>
              </template>
              <template #col-bookitemkey="row">
                <span class="fw-bold text-dark">{{ row.booktype }}:{{ row.bookitemkey }}</span>
              </template>
              <template #col-product_details="row">
                <div class="d-flex flex-column gap-1">
                  <span class="fw-bold text-dark fs-6">{{ row.title || '—' }}</span>
                  <div class="text-secondary small d-flex flex-column">
                    <span v-if="row.author">Author: {{ row.author }}</span>
                    <span v-if="row.bookedition">Edition: {{ row.bookedition }}</span>
                    <span v-if="row.ISBN">ISBN: {{ row.ISBN }}</span>
                  </div>
                </div>
              </template>

            </add-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddForm from "@/components/form/add-form.vue";
import api from "@/services/api";

export default {
  name: "AddStockRequest",
  components: {
    AddForm,
  },
  data() {
    return {
      nextRSNo: "",
      optionBranches: [],
      userBranchId: null,
    };
  },
  computed: {
    summaryFields() {
      return [
        {
          key: "RSNo",
          label: "Reference",
          type: "text",
          disabled: true,
          value: this.nextRSNo,
        },
        {
          key: "fromId",
          label: "From Location",
          type: "select",
          placeholder: "Select Origin",
          options: this.optionBranches,
          value: this.userBranchId
        },
        {
          key: "toId",
          label: "To Location",
          type: "select",
          placeholder: "Select Destination",
          options: this.optionBranches
        },
        {
          key: "remarks",
          label: "Memo",
          type: "textarea",
          placeholder: "Enter memo here...",
        }
      ];
    },
    fields() {
      return [
        {
          key: "product",
          label: "Product",
          type: "search",
          required: true,
          placeholder: "Enter product code or title",
          method: "get",
          endpoint: "/books/search",
          labelKey: "title",      // field from API for display
          valueKey: "id",         // unique identifier field from API
          minChars: 2,
          tableColumns: [
            { label: 'Item Key', key: 'bookitemkey' },
            { label: 'Product Details', key: 'product_details' },
            { label: 'Quantity', key: 'qty', editable: true },
          ]
        },
      ];
    },
  },
  created() {
    this.getNextRSNo();
    this.fetchBranches();
    this.fetchUserBranch();
  },
  methods: {
    async fetchBranches() {
      try {
        // get all branches
        const response = await api.get("/branches/list");
        const rawBranches = response.data || [];
        this.optionBranches = rawBranches.map((b) => ({
          label: b.branchstorename || b.branchname || b.name || "Unknown Branch",
          value: b.branchid || b.id,
        }));
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    },
    async fetchUserBranch() {
      try {
        const response = await api.get("/user/branch");
        // Assuming the first branch or an 'active' branch is the current one
        const activeBranch = response.data?.find(b => b.is_active) || response.data?.[0];
        if (activeBranch) {
          this.userBranchId = activeBranch.branchid;
        }
      } catch (error) {
        console.error("Failed to fetch user branch:", error);
      }
    },
    async getNextRSNo() {
      try {
        const responseData = await api.get("/branches/rs/next");
        this.nextRSNo =
          responseData?.RSNo ||
          responseData?.data?.RSNo ||
          responseData?.nextRSNo ||
          responseData?.data?.nextRSNo ||
          responseData?.data ||
          "";
      } catch (error) {
        console.error("Failed to fetch next RSNo:", error);
      }
    },
    async submitStockRequest(formData) {
      // The backend expects specific fields. We map the product list to the items format.
      const payload = {
        fromId: formData.fromId,
        toId: formData.toId,
        remarks: formData.remarks,
        items: (formData.product || []).map((item) => {
          return {
            // Try all possible ID fields; priority: documented bookId -> common id -> selector value
            bookId: item.bookId,
            qty: item.qty || 1,
          };
        }),
      };
      console.log("[StockRequest] Final Payload:", payload);

      try {
        await api.post("/branches/rs/add", payload);
        this.$router.push("/inventory/stock-request");
      } catch (error) {
        console.error("Stock request submission failed:", error);
      }
    },
  },
};
</script>

<style scoped>
.book-result-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.book-result-primary {
  display: flex;
  align-items: center;
  gap: 6px;
}

.book-type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
  background-color: #fff3e0;
  color: #FF9F43;
  border: 1px solid #ffd59e;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.book-item-key {
  font-size: 0.875rem;
  color: #1e293b;
}

.book-result-secondary {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.3;
  padding-left: 2px;
}
</style>

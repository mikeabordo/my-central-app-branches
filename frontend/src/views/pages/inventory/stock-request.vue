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
            <router-link to="/inventory/stock-request/add" class="btn btn-added btn-gradient warm">
              <vue-feather type="plus-circle" class="me-2"></vue-feather>New Stock Request
            </router-link>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <DynamicDataTable :headers="headers" :items="items" :loading="loading"
                  searchPlaceholder="Search requests by ID, book, or requester...">
                  <!-- Custom slot for Status -->
                  <template #item-status="item">
                    <span :class="['badge', getStatusClass(item.status)]">
                      {{ item.status }}
                    </span>
                  </template>

                  <!-- Custom slot for actions -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="`/inventory/stock-request/view/${item.RSNo}`"
                        class="btn btn-sm btn-icon-only btn-outline-dark" title="View Details">
                        <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
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





</template>

<script>
import DynamicDataTable from "@/components/DynamicDataTable.vue";
import api from "@/services/api";

export default {
  name: "StockRequest",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
      items: [],
      loading: false,
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
  },
  created() {
    this.getStockRequests();
  },
  methods: {

    async getStockRequests() {
      this.loading = true;
      try {
        const responseData = await api.get("/branches/rs/list");
        let fetchedStockRequests = responseData.data || responseData || [];
        this.items = Array.isArray(fetchedStockRequests) ? fetchedStockRequests : [];
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

.btn-icon-only {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}
</style>
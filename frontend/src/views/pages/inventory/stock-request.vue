<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Stock Request</h4>
              <p class="text-muted">Manage and track inventory replenishment requests.</p>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div class="card shadow-sm border-0">
              <div class="card-body">
                <DynamicDataTable
                  :headers="headers"
                  :items="items"
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
                      <button class="btn btn-sm btn-outline-success" title="Approve" @click="approveRequest(item)">
                        <vue-feather type="check" size="14"></vue-feather>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" title="Reject" @click="rejectRequest(item)">
                        <vue-feather type="x" size="14"></vue-feather>
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
</template>

<script>
import DynamicDataTable from "@/components/DynamicDataTable.vue";

export default {
  name: "StockRequest",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
      headers: [
        { text: "#", value: "index", sortable: true },
        { text: "ID", value: "id", sortable: true },
        { text: "Branch", value: "branch", sortable: true },
        { text: "Quantity", value: "quantity", sortable: true },
        { text: "Status", value: "status", sortable: true },
        { text: "Date", value: "date", sortable: true },
        { text: "Actions", value: "actions" },
      ],
      items: [
        {
          id: 1,
          requestId: "REQ-001",
          bookTitle: "The Great Gatsby",
          quantity: 20,
          requester: "John Doe",
          date: "2024-03-15",
          status: "Pending",
        },
        {
          id: 2,
          requestId: "REQ-002",
          bookTitle: "1984",
          quantity: 15,
          requester: "Jane Smith",
          date: "2024-03-14",
          status: "Approved",
        },
        {
          id: 3,
          requestId: "REQ-003",
          bookTitle: "The Hobbit",
          quantity: 10,
          requester: "Bob Wilson",
          date: "2024-03-13",
          status: "Rejected",
        },
        {
          id: 4,
          requestId: "REQ-004",
          bookTitle: "To Kill a Mockingbird",
          quantity: 5,
          requester: "Alice Brown",
          date: "2024-03-12",
          status: "Pending",
        },
      ],
    };
  },
  methods: {
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
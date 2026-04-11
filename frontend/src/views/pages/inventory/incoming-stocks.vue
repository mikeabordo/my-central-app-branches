<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Incoming Stocks</h4>
              <p class="text-muted">Manage your incoming stocks efficiently.</p>
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
                  searchPlaceholder="Search..."
                >
                  <!-- Custom slot for actions -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary" @click="editBook(item)">
                        <vue-feather type="edit-2" size="14"></vue-feather>
                      </button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteBook(item)">
                        <vue-feather type="trash-2" size="14"></vue-feather>
                      </button>
                    </div>
                  </template>

                  <!-- Custom slot for stock with conditional styling -->
                  <template #item-stock="item">
                    <span :class="['badge', item.stock < 10 ? 'bg-danger-light' : 'bg-success-light']">
                      {{ item.stock }} in stock
                    </span>
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
  name: "IncomingStocks",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
      items: [],
      loading: false,
      headers: [
        { text: "Title", value: "title", sortable: true },
        { text: "Author", value: "author", sortable: true },
        { text: "Product", value: "product", sortable: true },
        { text: "Edition", value: "edition", sortable: true },
        { text: "ISBN", value: "isbn", sortable: true },
        { text: "Price", value: "price", sortable: true },
        { text: "Quantity", value: "quantity", sortable: true },
        { text: "Actions", value: "actions" },
      ],
      
    };
  },

  created() {
    this.getIncomingStocks();
  },
  methods: {


    async getIncomingStocks() {
      this.loading = true;
      try {
        const responseData = await api.get("/branches/stocks/incoming");
        console.log("Incoming stocks JSON response:", responseData);
        let fetchedIncomingStocks = responseData.data || responseData || [];
        this.items = Array.isArray(fetchedIncomingStocks) ? fetchedIncomingStocks : [];
      } catch (error) {
        console.error("Failed to fetch incoming stocks:", error);
      }
    },
    editBook(book) {
      console.log("Editing book:", book);
    },
    deleteBook(book) {
      console.log("Deleting book:", book);
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
.badge {
  padding: 0.5em 0.8em;
  font-weight: 500;
  border-radius: 4px;
}
</style>

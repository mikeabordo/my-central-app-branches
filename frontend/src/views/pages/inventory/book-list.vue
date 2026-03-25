<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <div class="page-header">
          <div class="row">
            <div class="col-sm-12">
              <h4 class="page-title">Book List</h4>
              <p class="text-muted">Manage your inventory of books efficiently.</p>
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
                  :loading="loading"
                  searchPlaceholder="Search books by title, author, or ISBN..."
                >
                  <!-- Custom slot for actions -->
                  <template #item-actions="item">
                    <div class="table-actions d-flex gap-2">
                      <router-link :to="`/inventory/book-list/view/${item.id}`" class="btn btn-sm btn-outline-dark" title="View">
                         <vue-feather type="eye" size="14"></vue-feather>
                      </router-link>
                      <button class="btn btn-sm btn-outline-warning" @click="editBook(item)">
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
  name: "BookList",
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
      items: [
        {
          id: 1,
          title: "Book 1",
          author: "Author 1",
          product: "Product 1",
          edition: "Edition 1",
          isbn: "ISBN 1",
          price: "Price 1",
          quantity: "Quantity 1",
        },
        {
          id: 2,
          title: "Book 2",
          author: "Author 2",
          product: "Product 2",
          edition: "Edition 2",
          isbn: "ISBN 2",
          price: "Price 2",
          quantity: "Quantity 2",
        },
      ],
    };
  },
  created() {
    this.getBooks();
  },
  methods: {
    async getBooks() {
      this.loading = true;
      try {
        const responseData = await api.get("/books");
        const allBooks = responseData.data;
        this.items = allBooks.map((book) => {
          return {
            id: book.id,
            title: book.title,
            author: book.author,
            product: book.product,
            edition: book.edition,
            isbn: book.isbn,
            price: book.price,
            quantity: book.quantity,
          };
        });
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
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

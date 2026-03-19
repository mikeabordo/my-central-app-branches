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
                  searchPlaceholder="Search books by title, author, or ISBN..."
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

export default {
  name: "BookList",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
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
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          isbn: "978-0743273565",
          product: "Classic Literature",
          edition: "1st",
          price: "$15.99",
          quantity: 45,
        },
        {
          id: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          isbn: "978-0446310789",
          product: "Fiction",
          edition: "1st",
          price: "$12.50",
          quantity: 8,
        },
        {
          id: 3,
          title: "1984",
          author: "George Orwell",
          isbn: "978-0451524935",
          product: "Science Fiction",
          edition: "1st",
          price: "$10.99",
          quantity: 22,
        },
        {
          id: 4,
          title: "The Catcher in the Rye",
          author: "J.D. Salinger",
          isbn: "978-0316769174",
          product: "Classic",
          edition: "1st",
          price: "$14.00",
          quantity: 5,
        },
        {
          id: 5,
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          isbn: "978-0547928227",
          product: "Fantasy",
          edition: "1st",
          price: "$18.25",
          quantity: 15,
        },
      ],
    };
  },
  methods: {
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

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
        </div>

        <div class="row">
          <div class="col-sm-12">
            <add-form :submitLabel="'Submit Request'" :fields="fields" @create="submitStockRequest"
              @cancel="$router.push('/inventory/rs')" />
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
    };
  },
  computed: {
    fields() {
      return [
        {
          key: "RSNo",
          label: "Reference #",
          type: "text",
          required: true,
          disabled: true,
          value: this.nextRSNo,
        },
        {
          key: "remarks",
          label: "Remarks",
          type: "textarea",
          placeholder: "Enter remarks",
          required: true,
          rows: 5,
        },
        {
          key: "product",
          label: "Product",
          type: "search",
          required: true,
          placeholder: "Enter product code or title",
          endpoint: "/branches/books/search", // Replace with your actual search API endpoint
          labelKey: "name", // the property from the API response to show as the main label
          valueKey: "id",   // the property to use as the value
          minChars: 2,
          tableColumns: [
            { label: 'Product', key: 'itemKey' },
            { label: 'SKU', key: 'sku' },
            { label: 'Edition', key: 'edition' },
            { label: 'ISBN', key: 'isbn' },
            { label: 'Quantity', key: 'qty' },
          ]
        },
      ];
    },
  },
  created() {
    this.getNextRSNo();
  },
  methods: {
    async getNextRSNo() {
      try {
        const responseData = await api.get("/branches/next");
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
      try {
        await api.post("/branches/rs/add", formData);
        this.$router.push('/inventory/rs');
      } catch (error) {
        console.error("Stock request submission failed:", error);
      }
    },
  },
};
</script>

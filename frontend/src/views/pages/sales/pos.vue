<template>
  <div>
    <layout-header></layout-header>
    <layout-sidebar></layout-sidebar>
    <div class="page-wrapper">
      <div class="content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="row align-items-center">
            <div class="col-sm-12">
              <h4 class="page-title">Point of Sales (POS)</h4>
              <h6 class="page-subtitle">Enter the invoice number to begin</h6>
            </div>
          </div>
        </div>

        <!-- Sales Invoice & Branch Row -->
        <div class="row g-4 align-items-end mb-1">
          <div class="col-lg-6 col-md-7 col-sm-12">
            <div class="pos-invoice-card">
              <div class="pos-card-accent"></div>
              <div class="pos-card-body">
                <div class="pos-card-header-row">
                  <div class="pos-card-icon-badge">
                    <vue-feather type="file-text" size="20"></vue-feather>
                  </div>
                  <div>
                    <h6 class="pos-card-title">Sales Invoice</h6>
                    <p class="pos-card-subtitle">Enter or scan the invoice number to begin</p>
                  </div>
                </div>

                <form @submit.prevent="handleSearchInvoice">
                  <div class="pos-input-wrapper"
                    :class="{ 'is-focused': isInputFocused, 'has-value': invoiceNumber.length > 0 }">
                    <div class="pos-input-group">
                      <span class="pos-input-icon">
                        <vue-feather type="hash" size="18"></vue-feather>
                      </span>
                      <input type="text" class="pos-input" id="salesInvoiceNumber" v-model="invoiceNumber"
                        placeholder="Search by Invoice Number" @focus="isInputFocused = true"
                        @blur="isInputFocused = false" autocomplete="off" />
                      <button type="submit" class="pos-scan-btn" title="Search Invoice">
                        <vue-feather type="search" size="16"></vue-feather>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-5 col-sm-12">
            <!-- Payment Type Dropdown -->
            <div class="pos-dropdown-wrapper">
              <div class="pos-input-label-row">
                <label class="pos-label fw-700">Payment Type</label>
              </div>

              <div class="pos-custom-dropdown" :class="{ 'is-active': isPaymentOpen }">
                <div class="pos-dropdown-trigger" @click="isPaymentOpen = !isPaymentOpen">
                  <div class="d-flex align-items-center gap-2">
                    <div class="trigger-icon">
                      <vue-feather type="credit-card" size="16"></vue-feather>
                    </div>
                    <span class="trigger-text">{{ paymentTypeSelection }}</span>
                  </div>
                  <vue-feather :type="isPaymentOpen ? 'chevron-up' : 'chevron-down'" size="16"
                    class="chevron-icon"></vue-feather>
                </div>

                <div v-if="isPaymentOpen" class="pos-dropdown-overlay" @click="isPaymentOpen = false"></div>

                <transition name="fade-slide">
                  <div v-if="isPaymentOpen" class="pos-dropdown-menu">
                    <div v-for="type in paymentTypeOptions" :key="type" class="pos-dropdown-item"
                      :class="{ 'is-selected': paymentTypeSelection === type }"
                      @click="paymentTypeSelection = type; isPaymentOpen = false">
                      <div class="d-flex align-items-center gap-2">
                        <div class="item-dot" v-if="paymentTypeSelection === type"></div>
                        <span>{{ type }}</span>
                      </div>
                      <vue-feather v-if="paymentTypeSelection === type" type="check" size="14"
                        class="check-icon"></vue-feather>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <!-- Dropdown end-->
        </div>

        <!-- POS Transaction Content -->
        <div v-if="$route.query.invoice" class="pos-content-placeholder mt-4 d-flex flex-column gap-4 pb-5">

          <!-- Main Content Row -->
          <div class="row g-4 flex-grow-1">
            <!-- Left Column: Table & Fields -->
            <div :class="isCashSales ? 'col-lg-9' : 'col-lg-12'" class="d-flex flex-column gap-4">

              <!-- Table & Scan -->
              <div class="card p-4 flex-grow-1 mb-0 border-0 shadow-sm">
                <!-- Scan Section -->
                <div class="row mb-4 g-3 align-items-end">
                  <div class="col">
                    <div class="form-group mb-0">
                      <label class="form-label fw-700 small mb-2">Scan or Search Item</label>
                      <div class="pos-input-wrapper"
                        :class="{ 'is-focused': isScanFocused, 'has-value': scanItem.length > 0 }">
                        <div class="pos-input-group">
                          <span class="pos-input-icon">
                            <vue-feather class="text-dark" type="search" size="16"></vue-feather>
                          </span>
                          <input type="text" class="pos-input" v-model="scanItem" placeholder="Enter item key or title"
                            @focus="isScanFocused = true" @blur="isScanFocused = false" autocomplete="off">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-2" style="max-width: 100px;">
                    <div class="form-group mb-0">
                      <label class="form-label fw-700 small mb-2">Qty</label>
                      <div class="pos-input-wrapper"
                        :class="{ 'is-focused': isQtyFocused, 'has-value': String(scanQty).length > 0 }">
                        <div class="pos-input-group">
                          <input type="number" class="pos-input px-3" v-model="scanQty" placeholder="1"
                            @focus="isQtyFocused = true" @blur="isQtyFocused = false">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-auto">
                    <button class="btn btn-pos-primary shadow-sm px-4" style="min-width: 100px;">
                      Scan
                    </button>
                  </div>
                </div>

                <div class="table-container pt-2">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h6 class="fw-700 mb-0">Items</h6>
                    <span class="badge bg-soft-primary text-primary">{{ items.length }} Items</span>
                  </div>
                  <dynamic-data-table :headers="headers" :items="computedItems" :loading="loading"
                    :search-field="false">
                    <!-- Editable Price -->
                    <template #item-price="item">
                      <input type="number" class="pos-table-input pos-table-input--sm" :value="item.price"
                        @input="updateItem(item.id, 'price', $event.target.value)" min="0" step="0.01" />
                    </template>

                    <!-- Editable Qty -->
                    <template #item-qty="item">
                      <input type="number" class="pos-table-input pos-table-input--sm" :value="item.qty"
                        @input="updateItem(item.id, 'qty', $event.target.value)" min="0" step="1" />
                    </template>

                    <!-- Editable Discount -->
                    <template #item-discount="item">
                      <input type="number" class="pos-table-input pos-table-input--sm" :value="item.discount"
                        @input="updateItem(item.id, 'discount', $event.target.value)" min="0" step="0.01" />
                    </template>

                    <!-- Computed Amount (read-only) -->
                    <template #item-amount="item">
                      <span class="fw-600 text-dark">{{ formatCurrency(item.amount) }}</span>
                    </template>

                    <!-- Custom slot for Actions -->
                    <template #item-actions="item">
                      <div class="table-actions d-flex gap-2">
                        <button class="btn btn-sm btn-outline-danger border-0" @click="deleteBook(item)">
                          <vue-feather type="x" size="14"></vue-feather>
                        </button>
                      </div>
                    </template>
                  </dynamic-data-table>
                </div>
              </div>

              <!-- Fields -->
              <div class="card p-3 border-1 mb-0">
                <form @submit.prevent="handleCompleteSale">
                  <div class="row g-3">
                    <!-- Customer -->
                    <div class="col-md-4">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">Sold To</label>
                        <input type="text" class="form-control" v-model="customerName" placeholder="Enter name">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">TIN</label>
                        <input type="text" class="form-control" v-model="customerTin" placeholder="Enter tin">
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">Business Style</label>
                        <input type="text" class="form-control" v-model="customerBusinessStyle"
                          placeholder="Enter business style">
                      </div>
                    </div>

                    <!-- Address -->
                    <div class="col-md-7">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">Address</label>
                        <input type="text" class="form-control" v-model="customerAddress" placeholder="Enter address">
                      </div>
                    </div>
                    <div class="col-md-5">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">School/Company</label>
                        <input type="text" class="form-control" v-model="schoolCompany"
                          placeholder="Enter school/company">
                      </div>
                    </div>
                  </div>

                  <div class="row gx-2 mt-3">
                    <!-- Plastic Cover -->
                    <div class="col-md-3 col-6">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">Plastic Cover</label>
                        <input type="number" class="form-control" v-model="plasticCover" placeholder="Enter amount">
                      </div>
                    </div>
                    <div class="col-md-3 col-6">
                      <div class="form-group mb-0">
                        <label class="form-label fw-600 small mb-1">Qty</label>
                        <input type="number" class="form-control" v-model="plasticCoverQty" placeholder="Enter qty">
                      </div>
                    </div>
                  </div>
                  <div class="row gx-2 mt-3">
                    <!-- Tax Checkbox-->
                    <div class="col-md-3 col-6">
                      <div class="pos-checkbox-group">
                        <label class="pos-checkbox-wrapper">
                          <input type="checkbox" class="pos-checkbox-input" v-model="checkbox">
                          <span class="pos-checkbox-mark">
                            <vue-feather type="check" size="12"></vue-feather>
                          </span>
                          <span class="pos-checkbox-label">Apply Withholding Tax (1%)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

            </div>

            <!-- Right Column: Payment Method -->
            <div v-if="isCashSales" class="col-lg-3">
              <div class="card p-3 border-1 mb-0 h-100">
                <h6 class="fw-600 mb-3">Payment Method</h6>
                <div class="payment-methods-grid">
                  <!-- Options -->
                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Cash' }">
                    <input type="radio" name="payment" value="Cash" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-cash">
                        <vue-feather type="dollar-sign" size="24"></vue-feather>
                      </div>
                      <span class="tile-label">Cash</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Cheque' }">
                    <input type="radio" name="payment" value="Cheque" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-terminal">
                        <vue-feather type="mail" size="24"></vue-feather>
                      </div>
                      <span class="tile-label">Cheque</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Maya QR' }">
                    <input type="radio" name="payment" value="Maya QR" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-maya bg-black">
                        <img src="@/assets/img/logo/maya.svg" alt="Maya" class="img-fluid">
                      </div>
                      <span class="tile-label">Maya QR</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Maya Terminal' }">
                    <input type="radio" name="payment" value="Maya Terminal" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-maya bg-black">
                        <img src="@/assets/img/logo/maya.svg" alt="Maya" class="img-fluid">
                      </div>
                      <span class="tile-label">Maya Terminal</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'BPI' }">
                    <input type="radio" name="payment" value="BPI" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-bpi bg-white">
                        <img src="@/assets/img/logo/bpi.svg" alt="BPI" class="img-fluid">
                      </div>
                      <span class="tile-label">BPI</span>
                    </div>
                  </label>

                  <!-- <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'BDO' }">
                    <input type="radio" name="payment" value="BDO" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-radio"><span class="tile-radio-dot"></span></div>
                      <div class="tile-icon is-bdo bg-blue">
                        <img src="@/assets/img/logo/bdo.svg" alt="BDO" class="img-fluid">
                      </div>
                      <span class="tile-label">BDO</span>
                    </div>
                  </label> -->

                </div>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <div class="d-flex justify-content-end my-2 gap-4">
            <h4 class="fw-600">Total Payment: </h4>
            <h4 class="text-orange fw-600 pr-5">{{ totalPayment }}</h4>
          </div>
          <div class="mt-1 pt-1 d-flex justify-content-end gap-2 mt-auto">
            <button type="button" class="btn btn-outline-secondary px-4" @click="handleSaveDraft">Save as Draft</button>
            <button type="button" @click="handleCompleteSale"
              class="btn btn-warning px-4 text-white hover-up shadow-sm">
              Submit
            </button>
          </div>
        </div>

        <!-- Success Modal -->
        <success-modal :autoClose="5000" :visible.sync="showSuccessModal" :title="successModalTitle"
          :message="successModalMessage" @close="onSuccessModalClose" />
      </div>
    </div>
  </div>
</template>
<script>

import DynamicDataTable from "@/components/DynamicDataTable.vue";
import SuccessModal from "@/components/modals/success-modal.vue";
export default {
  name: "PosSales",
  components: {
    DynamicDataTable,
    SuccessModal,
  },
  data() {
    return {
      invoiceNumber: "",
      isPaymentOpen: false,
      paymentTypeSelection: "Cash Sales",
      paymentTypeOptions: ["Cash Sales", "Charge Sales"],
      isInputFocused: false,
      isScanFocused: false,
      isQtyFocused: false,
      headers: [
        { text: "#", value: "id" },
        { text: "Item Key", value: "itemKey" },
        { text: "Description", value: "description" },
        { text: "Price", value: "price" },
        { text: "Qty", value: "qty" },
        { text: "Discount", value: "discount" },
        { text: "Amount", value: "amount" },
        { text: "Actions", value: "actions" },
      ],
      items: [
        { id: "REQ-001", itemKey: "ITM-001", description: "The Great Gatsby", price: 100, qty: 10, discount: 10 },
        { id: "REQ-002", itemKey: "ITM-002", description: "To Kill a Mockingbird", price: 200, qty: 20, discount: 20 },
        { id: "REQ-003", itemKey: "ITM-003", description: "1984", price: 300, qty: 30, discount: 30 },
      ],
      loading: false,
      // Transaction Form Data
      customerName: "",
      customerTin: "",
      customerBusinessStyle: "",
      customerAddress: "",
      schoolCompany: "",
      plasticCover: "",
      plasticCoverQty: "",
      paymentMethod: "Cash",
      checkbox: false,
      scanItem: "",
      scanQty: 1,
      // Success Modal
      showSuccessModal: false,
      successModalTitle: 'Success!',
      successModalMessage: '',
    };
  },
  computed: {
    isCashSales() {
      return this.paymentTypeSelection === 'Cash Sales';
    },
    computedItems() {
      return this.items.map(item => ({
        ...item,
        amount: ((parseFloat(item.price) || 0) * (parseFloat(item.qty) || 0)) * (1 - (parseFloat(item.discount) || 0) / 100)
      }));
    },
    totalPayment() {
      let total = this.computedItems.reduce((acc, curr) => acc + curr.amount, 0);
      if (this.checkbox) {
        total -= total * 0.01;
      }
      return this.formatCurrency(total);
    }
  },

  mounted() {
    // Clear any leftover query params on page load / reload
    if (Object.keys(this.$route.query).length) {
      this.$router.replace({ name: "pos" });
    }
  },

  methods: {
    handleSearchInvoice() {
      const invoice = this.invoiceNumber.trim();

      if (invoice) {
        // Update URL with invoice query
        this.$router.replace({ name: "pos", query: { invoice } });
      } else {
        // Clear query if input is empty
        this.$router.replace({ name: "pos", query: {} });
      }

      console.log("Searching for invoice:", invoice || "(Cleared)");
      // TODO: fetch invoice data from API using `invoice`
    },
    handleCompleteSale() {
      console.log("Submitting transaction for:", this.customerName, this.customerAddress);
      // Reset dropdown to default
      this.paymentTypeSelection = 'Cash Sales';
      // Show success modal
      this.successModalTitle = 'Transaction Complete!';
      this.successModalMessage = `Transaction for ${this.customerName || 'Walk-in Customer'} has been submitted successfully.`;
      this.showSuccessModal = true;
    },
    handleSaveDraft() {
      console.log("Saving draft for:", this.customerName);
      this.successModalTitle = 'Draft Saved!';
      this.successModalMessage = 'Your transaction draft has been saved. You can continue editing later.';
      this.showSuccessModal = true;
    },
    onSuccessModalClose() {
      this.showSuccessModal = false;
    },
    deleteBook(item) {
      this.items = this.items.filter(i => i.id !== item.id);
    },
    updateItem(id, field, value) {
      const item = this.items.find(i => i.id === id);
      if (item) {
        item[field] = parseFloat(value) || 0;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
    },

  },
};
</script>

<style scoped>
/* ── Card ─────────────────────────────────────────── */
.pos-invoice-card {
  position: relative;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(27, 40, 80, 0.06);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.pos-invoice-card:hover {
  box-shadow: 0 6px 24px rgba(27, 40, 80, 0.10);
  transform: translateY(-2px);
}

/* Gradient accent bar */
.pos-card-accent {
  height: 4px;
  background: linear-gradient(90deg, #FF9F43 0%, #ff7b00 50%, #FF9F43 100%);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

.pos-card-body {
  padding: 28px 28px 32px;
}

/* ── Header row ───────────────────────────────────── */
.pos-card-header-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.pos-card-icon-badge {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 159, 67, 0.12);
  color: #FF9F43;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pos-card-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: #1B2850;
  margin: 0;
  line-height: 1.3;
}

.pos-card-subtitle {
  font-size: 12.5px;
  color: #8c94a5;
  margin: 2px 0 0;
  line-height: 1.3;
}

/* ── Input group ──────────────────────────────────── */
.pos-input-wrapper {
  position: relative;
}

.pos-input-group {
  display: flex;
  align-items: center;
  background: #f8f9fc;
  border: 1.5px solid #e4e8f0;
  border-radius: 10px;
  padding: 0 4px 0 0;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
}

/* Focus state */
.pos-input-wrapper.is-focused .pos-input-group {
  border-color: #FF9F43;
  box-shadow: 0 0 0 3.5px rgba(255, 159, 67, 0.13);
  background: #ffffff;
}

.pos-input-separator {
  width: 1.5px;
  height: 24px;
  background-color: #e4e8f0;
}

.pos-qty-unit {
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.pos-qty-unit:focus-within {
  background-color: rgba(255, 159, 67, 0.08) !important;
  border-color: rgba(255, 159, 67, 0.2);
}

.pos-qty-mini-input::-webkit-inner-spin-button,
.pos-qty-mini-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Has-value state */
.pos-input-wrapper.has-value .pos-input-group {
  background: #ffffff;
  border-color: #d0d5e0;
}

.pos-input-wrapper.has-value.is-focused .pos-input-group {
  border-color: #FF9F43;
}

/* Icon */
.pos-input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2px 0 14px;
  color: #b0b7c3;
  transition: color 0.25s ease;
}

.pos-input-wrapper.is-focused .pos-input-icon {
  color: #FF9F43;
}

/* Input */
.pos-input {
  flex: 1;
  min-width: 0;
  width: 100%;
  border: none;
  background: transparent;
  padding: 13px 12px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1B2850;
  letter-spacing: 0.3px;
  outline: none;
}

.pos-input::placeholder {
  color: #b0b7c3;
  font-weight: 400;
}

/* Search / scan button */
.pos-scan-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #FF9F43, #ff8510);
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pos-scan-btn:hover {
  transform: scale(1.07);
  box-shadow: 0 3px 10px rgba(255, 159, 67, 0.35);
}

.pos-scan-btn:active {
  transform: scale(0.97);
}

/* ── Transaction Form Helpers ─────────────────────── */
.fw-600 {
  font-weight: 600;
}

.text-xs {
  font-size: 0.75rem;
}

.hover-up {
  transition: transform 0.2s ease;
}

.hover-up:hover {
  transform: translateY(-2px);
}

.border-dashed {
  border-style: dashed !important;
}

.form-label {
  letter-spacing: 0.025em;
}

.form-control:focus,
.form-select:focus {
  border-color: #FF9F43;
  box-shadow: 0 0 0 0.2rem rgba(255, 159, 67, 0.15);
}

/* ── Payment Method Tiles ────────────────────────── */
.payment-methods-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method-tile {
  cursor: pointer;
  margin-bottom: 0;
  width: 100%;
}

.tile-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1.5px solid #edf2f7;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* ── Custom Radio Circle ("hole") ─────────────────── */
.tile-radio {
  width: 20px;
  height: 20px;
  min-width: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
}

.tile-radio-dot {
  width: 0;
  height: 0;
  border-radius: 50%;
  background: #FF9F43;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0;
}

/* Radio hover */
.payment-method-tile:hover .tile-radio {
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* Radio active/selected */
.payment-method-tile.active .tile-radio {
  border-color: #FF9F43;
  background: #fff8f1;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.15);
}

.payment-method-tile.active .tile-radio-dot {
  width: 10px;
  height: 10px;
  opacity: 1;
  background: linear-gradient(135deg, #FF9F43, #ff8510);
  box-shadow: 0 1px 4px rgba(255, 133, 16, 0.4);
}

.tile-icon {
  width: 64px;
  height: 64px;
  background: #ffffff;
  border: 1.5px solid #f1f5f9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8c94a5;
  transition: all 0.25s ease;
  overflow: hidden;
  padding: 6px;
  flex-shrink: 0;
}

.tile-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tile-label {
  font-size: 13.5px;
  font-weight: 600;
  color: #1B2850;
  transition: color 0.25s ease;
  flex: 1;
  min-width: 0;
}

/* Hover State */
.payment-method-tile:hover .tile-content {
  background: #ffffff;
  border-color: #d0d5e0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 40, 80, 0.06);
}

/* Active / Selected State / Payment Method */
.payment-method-tile.active .tile-content {
  background: linear-gradient(135deg, #fffbf5 0%, #fff4e8 100%);
  border-color: #FF9F4380;
  box-shadow:
    0 0 0 1px rgba(255, 159, 67, 0.04),
    0 6px 16px rgba(255, 159, 67, 0.08);
}

.payment-method-tile.active .tile-icon {
  border-color: rgba(255, 159, 67, 0.3);
}

.payment-method-tile.active .tile-label {
  color: #e0850a;
}

/* ── Icon Variants (Inactive) ───────────────────── */
.tile-icon.is-cash {
  color: #10b981;
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.2);
}

.tile-icon.is-terminal {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.2);
}

.tile-icon.is-maya {
  color: #8b5cf6;
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.2);
}

.tile-icon.is-bpi {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.2);
}

.tile-icon.is-bdo {
  color: #1e3a8a;
  background: rgba(30, 58, 138, 0.08);
  border-color: rgba(30, 58, 138, 0.2);
}

/* ── Active State Overrides ─────────────────────── */
.payment-method-tile.active .tile-icon.is-cash,
.payment-method-tile.active .tile-icon.is-terminal,
.payment-method-tile.active .tile-icon.is-maya,
.payment-method-tile.active .tile-icon.is-bpi,
.payment-method-tile.active .tile-icon.is-bdo {
  border-width: 1.5px;
}

/* ── POS Primary Button behavior ──────────────────── */
.btn-pos-primary {
  background: linear-gradient(135deg, #FF9F43, #ff8510);
  border: none;
  color: #ffffff;
  font-weight: 600;
  border-radius: 8px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-pos-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(255, 159, 67, 0.4);
  color: #fff;
}

.btn-pos-primary:active {
  transform: scale(0.96);
}

/* ── Custom Checkbox ──────────────────────────────── */
.pos-checkbox-group {
  display: flex;
  align-items: center;
  height: 100%;
}

.pos-checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  margin-bottom: 0;
  transition: transform 0.2s ease;
}

.pos-checkbox-wrapper:active {
  transform: scale(0.96);
}

.pos-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.pos-checkbox-mark {
  width: 22px;
  height: 22px;
  background: #f8f9fc;
  border: 1.5px solid #8e9198;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.pos-checkbox-wrapper:hover .pos-checkbox-mark {
  border-color: #FF9F43;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 159, 67, 0.15);
}

.pos-checkbox-input:checked~.pos-checkbox-mark {
  background: #FF9F43;
  border-color: #FF9F43;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(255, 159, 67, 0.3);
}

.pos-checkbox-label {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  transition: color 0.25s ease;
}

.pos-checkbox-input:checked~.pos-checkbox-label {
  color: #1B2850;
}

/* ── Premium Branch Dropdown ───────────────────────── */
.pos-dropdown-wrapper {
  animation: fadeIn 0.5s ease-out;
}

.pos-input-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 0 4px;
}

.pos-label {
  font-size: 11px;
  font-weight: 700;
  color: #8c94a5;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

.pos-badge-status {
  font-size: 10px;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
}

.pos-custom-dropdown {
  position: relative;
  z-index: 100;
}

.pos-dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border: 1.5px solid #e4e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(27, 40, 80, 0.04);
}

.pos-custom-dropdown:hover .pos-dropdown-trigger {
  border-color: #d0d5e0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 40, 80, 0.06);
}

.pos-custom-dropdown.is-active .pos-dropdown-trigger {
  border-color: #FF9F43;
  box-shadow: 0 0 0 4px rgba(255, 159, 67, 0.12);
  background: #ffffff;
}

.trigger-icon {
  width: 30px;
  height: 30px;
  background: rgba(255, 159, 67, 0.1);
  color: #FF9F43;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.pos-custom-dropdown.is-active .trigger-icon {
  background: #FF9F43;
  color: #ffffff;
}

.trigger-text {
  font-size: 14px;
  font-weight: 600;
  color: #1B2850;
}

.chevron-icon {
  color: #b0b7c3;
  transition: transform 0.3s ease;
}

.pos-custom-dropdown.is-active .chevron-icon {
  color: #FF9F43;
}

.pos-dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 99;
  background: transparent;
}

.pos-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid rgba(27, 40, 80, 0.08);
  border-radius: 14px;
  box-shadow: 0 15px 35px rgba(27, 40, 80, 0.15);
  padding: 8px;
  z-index: 100;
  overflow: hidden;
}

.pos-dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
}

.pos-dropdown-item:hover {
  background: #f8f9fc;
  color: #FF9F43;
  padding-left: 18px;
}

.pos-dropdown-item.is-selected {
  background: rgba(255, 159, 67, 0.08);
  color: #FF9F43;
  font-weight: 600;
}

.item-dot {
  width: 6px;
  height: 6px;
  background: #FF9F43;
  border-radius: 50%;
}

.check-icon {
  color: #FF9F43;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Editable Table Inputs ────────────────────────── */
.pos-table-input {
  width: 110px;
  padding: 6px 10px;
  border: 1.5px solid #e4e8f0;
  border-radius: 8px;
  background: #f8f9fc;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #1B2850;
  text-align: left;
  outline: none;
  transition: all 0.2s ease;
  -moz-appearance: textfield;
  appearance: textfield;
}

.pos-table-input::-webkit-inner-spin-button,
.pos-table-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.pos-table-input:focus {
  border-color: #FF9F43;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(255, 159, 67, 0.12);
}

.pos-table-input:hover:not(:focus) {
  border-color: #d0d5e0;
  background: #ffffff;
}

.pos-table-input--sm {
  width: 70px;
}
</style>
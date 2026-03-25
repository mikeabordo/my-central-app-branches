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
              <h6 class="page-subtitle">Enter or scan the invoice number to begin</h6>
            </div>
          </div>
        </div>

        <!-- Sales Invoice Card -->
        <div class="row">
          <div class="col-lg-6 col-md-8 col-sm-12">
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
        </div>

        <!-- Scan -->
        <div v-if="$route.query.invoice" class="pos-content-placeholder mt-4 d-flex flex-column gap-4 pb-5">
          <div class="card p-3">
            <div class="row">
              <div class="col-md-5">
                <div class="form-group">
                  <label class="form-label fw-600 small mb-1">Scan</label>
                  <input type="text" class="form-control" v-model="customerName" placeholder="Enter item">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label class="form-label fw-600 small mb-1">Qty</label>
                  <input type="text" class="form-control" v-model="customerName" placeholder="Enter qty">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <button class="btn btn-primary mt-4">Scan</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content Row -->
          <div class="row g-4 flex-grow-1">
            <!-- Left Column: Table & Fields -->
            <div class="col-lg-9 d-flex flex-column gap-4">

              <!-- Table -->
              <div class="card p-3 flex-grow-1 mb-0">
                <dynamic-data-table :headers="headers" :items="items" :loading="loading" :search-field="false">
                  <!-- Custom slot for Actions -->
                  <template #item-actions="{ id }">
                    <div class="d-flex gap-2">
                      <button @click="handleApprove(id)" class="btn btn-sm btn-success" title="Approve">
                        <vue-feather type="check" size="14"></vue-feather>
                      </button>
                      <button @click="handleReject(id)" class="btn btn-sm btn-danger" title="Reject">
                        <vue-feather type="x" size="14"></vue-feather>
                      </button>
                    </div>
                  </template>
                </dynamic-data-table>
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
                </form>
              </div>

            </div>

            <!-- Right Column: Payment Method -->
            <div class="col-lg-3">
              <div class="card p-3 border-1 mb-0 h-100">
                <h6 class="fw-600 mb-3">Payment Method</h6>
                <div class="payment-methods-grid">
                  <!-- Options -->
                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Cash' }">
                    <input type="radio" name="payment" value="Cash" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-cash">
                        <vue-feather type="dollar-sign" size="24"></vue-feather>
                      </div>
                      <span class="tile-label">Cash</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Debit/Credit Terminal' }">
                    <input type="radio" name="payment" value="Debit/Credit Terminal" v-model="paymentMethod"
                      class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-terminal">
                        <vue-feather type="credit-card" size="24"></vue-feather>
                      </div>
                      <span class="tile-label">Debit/Credit Terminal</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Maya QR' }">
                    <input type="radio" name="payment" value="Maya QR" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-maya bg-black">
                        <img src="@/assets/img/logo/maya.svg" alt="Maya" class="img-fluid">
                      </div>
                      <span class="tile-label">Maya QR</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'Maya Terminal' }">
                    <input type="radio" name="payment" value="Maya Terminal" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-maya bg-black">
                        <img src="@/assets/img/logo/maya.svg" alt="Maya" class="img-fluid">
                      </div>
                      <span class="tile-label">Maya Terminal</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'BPI' }">
                    <input type="radio" name="payment" value="BPI" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-bpi bg-white">
                        <img src="@/assets/img/logo/bpi.svg" alt="BPI" class="img-fluid">
                      </div>
                      <span class="tile-label">BPI</span>
                    </div>
                  </label>

                  <label class="payment-method-tile" :class="{ 'active': paymentMethod === 'BDO' }">
                    <input type="radio" name="payment" value="BDO" v-model="paymentMethod" class="d-none">
                    <div class="tile-content">
                      <div class="tile-icon is-bdo bg-blue">
                        <img src="@/assets/img/logo/bdo.svg" alt="BDO" class="img-fluid">
                      </div>
                      <span class="tile-label">BDO</span>
                    </div>
                  </label>
                  <div class="d-flex justify-content-between my-2 ">
                    <h4 class="fw-600">Total Payment: </h4>
                    <h4 class="text-orange fw-600 pr-5">{{ totalPayment }}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Actions -->
          <div class="mt-1 pt-1 d-flex justify-content-end gap-2 mt-auto">
            <button type="button" class="btn btn-light px-4" @click="handleSaveDraft">Save as Draft</button>
            <button type="submit" class="btn btn-warning px-4 text-white hover-up shadow-sm">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import DynamicDataTable from "@/components/DynamicDataTable.vue";
export default {
  name: "PosSales",
  components: {
    DynamicDataTable,
  },
  data() {
    return {
      invoiceNumber: "",
      isInputFocused: false,
      headers: [
        { text: "#", value: "id" },
        { text: "Item Key", value: "itemKey" },
        { text: "Description", value: "description" },
        { text: "Price", value: "price" },
        { text: "Qty", value: "qty" },
        { text: "Discount", value: "discount" },
        { text: "Amount", value: "amount" },
      ],
      items: [
        { id: "REQ-001", itemKey: "ITM-001", description: "The Great Gatsby", price: "100", qty: "10", discount: "10", amount: "900" },
        { id: "REQ-002", itemKey: "ITM-002", description: "To Kill a Mockingbird", price: "200", qty: "20", discount: "20", amount: "1800" },
        { id: "REQ-003", itemKey: "ITM-003", description: "1984", price: "300", qty: "30", discount: "30", amount: "2700" },
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
    };
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
      alert(`Transaction for ${this.customerName || 'Walk-in Customer'} submitted successfully!`);
    },
    handleSaveDraft() {
      console.log("Saving draft for:", this.customerName);
      alert("Draft saved!");
    }
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
  gap: 12px;
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
  padding: 12px 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
  border: 1.5px solid #edf2f7;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
}

.tile-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.tile-label {
  font-size: 14px;
  font-weight: 600;
  color: #1B2850;
  transition: color 0.25s ease;
}

/* Hover State */
.payment-method-tile:hover .tile-content {
  background: #ffffff;
  border-color: #d0d5e0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(27, 40, 80, 0.04);
}

/* Active / Selected State */
.payment-method-tile.active .tile-content {
  background: #ffffff;
  border-color: #FF9F43;
  box-shadow: 0 0 0 1px #FF9F43, 0 8px 20px rgba(255, 159, 67, 0.10);
}

.payment-method-tile.active .tile-icon {
  border-color: #cbd5e1;
}

.payment-method-tile.active .tile-label {
  color: #FF9F43;
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
</style>
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
                  <div class="pos-input-wrapper" :class="{ 'is-focused': isInputFocused, 'has-value': invoiceNumber.length > 0 }">
                    <div class="pos-input-group">
                      <span class="pos-input-icon">
                        <vue-feather type="hash" size="18"></vue-feather>
                      </span>
                      <input
                        type="text"
                        class="pos-input"
                        id="salesInvoiceNumber"
                        v-model="invoiceNumber"
                        placeholder="Search by Invoice Number"
                        @focus="isInputFocused = true"
                        @blur="isInputFocused = false"
                        autocomplete="off"
                      />
                      <button
                        type="submit"
                        class="pos-scan-btn"
                        title="Search Invoice"
                      >
                        <vue-feather type="search" size="16"></vue-feather>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <!-- Content -->
         <div v-if="$route.query.invoice" class="pos-content-placeholder mt-3">
           <div class="card p-4">
             <h4 class="text-muted mb-0">Content Goes Here</h4>
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PosSales",
  data() {
    return {
      invoiceNumber: "",
      isInputFocused: false,
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
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
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
</style>
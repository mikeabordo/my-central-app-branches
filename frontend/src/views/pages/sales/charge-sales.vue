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
                            <h4 class="page-title">Charge Sales</h4>
                            <h6 class="page-subtitle">View and manage sales made on credit/charge.</h6>
                        </div>
                    </div>
                </div>

                <!-- Table Section -->
                <div class="row">
                    <div class="col-sm-12">
                        <div class="card shadow-sm border-0">
                            <div class="card-body">
                                <DynamicDataTable :headers="headers" :items="items" :loading="loading"
                                    searchPlaceholder="Search by customer name or invoice number...">

                                    <!-- Custom slot for Status -->
                                    <template #item-status="item">
                                        <span :class="['badge', getStatusClass(item.status)]">
                                            {{ item.status }}
                                        </span>
                                    </template>

                                    <!-- Custom slot for Amount -->
                                    <template #item-totalAmount="item">
                                        <span class="fw-600">{{ formatCurrency(item.totalAmount) }}</span>
                                    </template>

                                    <!-- Custom slot for Date -->
                                    <template #item-date="item">
                                        <span class="text-muted small">{{ formatDate(item.date) }}</span>
                                    </template>

                                    <!-- Custom slot for Actions -->
                                    <template #item-actions="item">
                                        <div class="table-actions d-flex gap-2">
                                            <router-link :to="`/sales/charge-sales/view/${item.id}`"
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

export default {
    name: "ChargeSales",
    components: {
        DynamicDataTable,
    },
    data() {
        return {
            loading: false,
            headers: [
                { text: "Sold To", value: "customerName", sortable: true },
                { text: "Address", value: "address", sortable: true },
                { text: "Business Style", value: "businessStyle", sortable: true },
                { text: "School / Company", value: "schoolCompany", sortable: true },
                { text: "Status", value: "status", sortable: true },
                { text: "Actions", value: "actions" },
            ],
            items: [
                { id: 1, customerName: "John Doe", address: "123 Main St Barangay Sangandaan Quezon City", businessStyle: "Sole Proprietorship", schoolCompany: "School A", status: "Unpaid" },
                { id: 2, customerName: "Jane Smith", address: "456 Oak Ave", businessStyle: "Corporation", schoolCompany: "Company B", status: "Paid" },
                { id: 3, customerName: "Acme Corp", address: "789 Pine Ln", businessStyle: "Partnership", schoolCompany: "School C", status: "Partially Paid" },
                { id: 4, customerName: "Bob Johnson", address: "101 Maple Dr", businessStyle: "Sole Proprietorship", schoolCompany: "Company D", status: "Pending" },
                { id: 5, customerName: "Alice Williams", address: "112 Birch Rd", businessStyle: "Corporation", schoolCompany: "School E", status: "Paid" },
            ],
        };
    },
    methods: {
        getStatusClass(status) {
            switch (status) {
                case "Paid":
                    return "bg-success-light text-success";
                case "Partially Paid":
                    return "bg-warning-light text-warning";
                case "Pending":
                    return "bg-danger-light text-danger";
                default:
                    return "bg-secondary-light text-secondary";
            }
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
        },
        formatDate(dateStr) {
            if (!dateStr) return "-";
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
};
</script>

<style scoped>
/* Modern Badge Styling */
.badge {
    padding: 0.5em 0.85em;
    font-weight: 600;
    border-radius: 6px;
    font-size: 12px;
    letter-spacing: 0.3px;
}

.bg-danger-light {
    background-color: rgba(255, 77, 77, 0.12);
    color: #ff4d4d;
}

.bg-success-light {
    background-color: rgba(40, 199, 111, 0.12);
    color: #28c76f;
}

.bg-warning-light {
    background-color: rgba(255, 159, 67, 0.12);
    color: #ff9f43;
}

.bg-secondary-light {
    background-color: rgba(108, 117, 125, 0.12);
    color: #6c757d;
}

/* Table Utilities */
.fw-600 {
    font-weight: 600;
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


/* Page Button Header */
.btn-added {
    background: #FF9F43;
    color: #fff;
    border: none;
    font-weight: 600;
    padding: 10px 20px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 4px 14px rgba(255, 159, 67, 0.25);
    transition: all 0.25s ease;
}

.btn-added:hover {
    background: #ff8510;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255, 159, 67, 0.35);
    color: #fff;
}

.btn-added:active {
    transform: translateY(0);
}

.page-title h4 {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    color: #1B2850;
    margin-bottom: 4px;
}

.page-title h6 {
    color: #8c94a5;
    font-size: 14px;
}
</style>

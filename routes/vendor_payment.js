const express = require('express');
const router = express.Router();
const VendorPayment = require('../models/vendorPayment');

// Create a new Invoice
router.post('/', async (req, res) => {
    console.log("BODY:", req.body);
    try {
        const vendorPayment = new VendorPayment(req.body);
        const savedPayment = await vendorPayment.save();
        res.json(savedPayment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all invoices
router.get('/', async (req, res) => {
    try {
        const vendorPayments = await VendorPayment.find();
        res.json(vendorPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get invoices by payment status
router.get('/status/:payment_status', async (req, res) => {
    try {
        const vendorPayments = await VendorPayment.find({
            payment_status: req.params.payment_status
        });
        res.json(vendorPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get invoices by vendor ID
router.get('/vendor/:vendor_id', async (req, res) => {
    try {
        const vendorPayments = await VendorPayment.find({
            vendor_id: req.params.vendor_id
        });
        res.json(vendorPayments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a vendor payment
router.put('/:transaction_id', async (req, res) => {
    try {
        const transaction = await VendorPayment.findOne({
            transaction_id: req.params.transaction_id
        });

        if (!transaction) {
            return res.status(400).json({ message: "No such transaction found" });
        }

        const amount = req.body.amount;
        if (!amount) {
            return res.status(400).json({ message: "Amount is required" });
        }

        transaction.balance_amount -= amount;

        if (transaction.balance_amount <= 0) {
            transaction.payment_status = "Fully Paid";
            transaction.balance_amount = 0;
        } else {
            transaction.payment_status = "Partially Paid";
        }

        transaction.payment_date = new Date();

        const savedPayment = await transaction.save();
        res.json(savedPayment);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});

// Delete a vendor transaction
router.delete('/:transaction_id', async (req, res) => {
    try {
        await VendorPayment.deleteOne({ transaction_id: req.params.transaction_id });
        res.json({ message: 'Vendor Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
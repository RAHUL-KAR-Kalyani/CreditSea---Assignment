const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
	subscriberName: String,
	accountNumber: String,
	portfolioType: String,
	accountType: String,
	openDate: String,
	creditLimit: Number,
	currentBalance: Number,
	amountPastDue: Number,
	accountStatus: String,
	paymentHistoryProfile: String,
	dateReported: String,
	holder: {
		surname: String,
		firstName: String,
		pan: String,
		dateOfBirth: String,
		address: {
			line1: String, line2: String, city: String, state: String, zip: String
		},
		phones: [String]
	},
	raw: mongoose.Schema.Types.Mixed
}, { _id: false });

const ReportSchema = new mongoose.Schema({
	name: String,
	firstName: String,
	lastName: String,
	mobile: String,
	pan: String,
	dateOfBirth: String,
	score: Number,
	scoreConfidence: String,
	totalAccounts: Number,
	activeAccounts: Number,
	closedAccounts: Number,
	securedOutstanding: Number,
	unsecuredOutstanding: Number,
	totalOutstanding: Number,
	inquiriesLast7Days: Number,
	accounts: [AccountSchema],
	rawXml: String,
	createdAt: { type: Date, default: Date.now }
});

ReportSchema.index({ pan: 1 });
ReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);

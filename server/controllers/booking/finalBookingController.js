const qrcode = require('qrcode');
const {v4: uuidv4} = require('uuid');
const LockBookingModel = require('../../models/lockBookingModel');
const BookingModel = require('../../models/bookingsModel');
const UserModel  = require('../../models/userModel');

const sendQrCode = require('../../helper/bookingHelper');

//Once the user pays, the user will send the booking id and the payment id to the
// finalbooking controller which will check the payment id and the booking id and
// confirm the booking and send a permanent booking id to the user. It will also delete the
// temporary booking id.
const finalBookingController = async (req, res, next) => {

	const lockId = req.body.lockId;
	const paymentId = req.body.paymentId;
	const userId = req.userId;

	// check the payment Id for payment status
	// if payment is successful, then create a permanent booking id
	// and send it to the user. Also delete the temp booking id (lockId)

	// validate the payment id
	// isPaymentDone(paymentId)

	const bookingData = await LockBookingModel.findOne({ lockId: lockId });
	if(bookingData === null) {
		res.status(400).json({
			message: "Invalid booking id"
		});
	}
	else{
		const bookingId = uuidv4();

		const bookingSchema = BookingModel({
			bookingId: bookingId,
			userId : userId,
			locationId: bookingData.locationId,
			dateOfVisit: bookingData.dateOfVisit,
			noOfTickets: bookingData.noOfTickets,
			bookingPrice: bookingData.bookingPrice,
			timeOfBooking: new Date()
		});

		const bookingDataSaveResult = await bookingSchema.save();
		console.log(bookingDataSaveResult);
		if(bookingDataSaveResult === null) {
			console.log("Error dsaving booking data".red);
			res.status(400).json({
				message: "Error saving booking data"
			});
		}
		else{
			console.log("Booking data saved successfully".green);
			console.log("Saving the booking data in User Model". yellow);

			const userModelUpdateResult  = await UserModel.findByIdAndUpdate(req.userId, {
				$push: { bookings: { bookingId: bookingId } },
				$inc: { bookingCount: 1 }
			});

			if(userModelUpdateResult === null) {
				console.log("Error saving booking data in user model".red);
				return res.status(400).json({
					message: "Error saving booking data in user model"
				});
			}
			res.status(200).json({
				message: "Booking successful",
				bookingId: bookingId
			});

			// delete the lock booking data
			const deleteLockIdResult = await LockBookingModel.deleteOne({ lockId: lockId });
			if(deleteLockIdResult === null) {
				console.log("Error deleting lock id".red);
			}
			else{
				console.log("Lock id deleted successfully".green);
			}

			// generate the qr for the booking id and send that qr to user email id
			const qrFile = './public/qr/'+bookingId+'.png';
			const qrResult = await qrcode.toFile(qrFile, bookingId, {
				version: 5,
				errorCorrectionLevel: 'H',
				margin: 1,
				scale: 10
			});

			if(qrResult === null) {
				console.log("Error generating qr code".red);
			}
			else{
				console.log("QR code generated successfully".green);
				// once genrereated, send out an email to the user with th qr code and booking details
				while(true) {
					const sendEmailResult = await sendQrCode(bookingId, req.userEmail);
					if(sendEmailResult === true) {
						console.log("QR code sent successfully".green);
						break;
					}
					else{
						console.log("Error sending qr code".red);
					}
				}
			}
		}
	}
}

module.exports = finalBookingController;
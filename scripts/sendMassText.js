require("dotenv").config();

const {
	getSpanishPatients,
	getPatientViaPhoneNumber,
} = require("../queries/patient");
const { handleOutBoundMessage } = require("../controllers/messages");
const { eachOfSeries } = require("async");
const delay = require("delay");

const spanishAnnouncement = `Hi! We're going to be offering Parentbirth en Español soon, meaning you'll be able to text with one of our virtual doulas in Spanish. Is that something you'd be interested in? Please respond with a quick YES or NO!`;

/////////// !! STOP !! /////////////
////////[x]  UPDATE Response
////////[x]  UPDATE Mongo URI
////////[x]  UPDATE Phone Number

const sendMassText = async () => {
	let index = 0;

	const patients = await getSpanishPatients();

	await eachOfSeries(patients, async (patient) => {
		console.log("waiting...");
		await delay(2000);

		const message = {
			phoneNumber: patient.phoneNumber,
			body: spanishAnnouncement,
		};

		await handleOutBoundMessage(message);

		console.log(`Sent to ${patient.phoneNumber}`);
		index = index + 1;
		console.log(`Index ${index}`);
	});
};

sendMassText();

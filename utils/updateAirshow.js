const Airshow = require('./models/Airshow');
const Ticket = require('./models/Ticket');

// Function to create 150 tickets for an airshow
async function createTicketsForAirshow(airshow) {
  try {
    // Initialize sections and classes
    const sections = ['left', 'center', 'right'];
    const classes = ['economy', 'business'];

    const tickets = [];
    
    // Create 150 tickets (50 per section: 25 economy, 25 business)
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];

      // Create 25 economy and 25 business tickets per section
      for (let i = 0; i < 25; i++) {
        for (const ticketClass of classes) {
          const desc = `Ticket for ${ticketClass} class in section ${section}`; // Description
          
          const ticket = new Ticket({
            section,
            desc,
            class: ticketClass,
            airshowId: airshow._id, // Associate ticket with the airshow
          });
          
          await ticket.save();
          tickets.push(ticket._id);
        }
      }
    }

    // Associate tickets with the airshow
    airshow.tickets = tickets;
    await airshow.save();

    console.log(`Airshow '${airshow.name}' updated with 150 tickets`);
  } catch (error) {
    console.error(`Error creating tickets for airshow '${airshow.name}':`, error);
  }
}

// Main function to update existing airshows
async function updateExistingAirshows() {
  try {
    // Retrieve the airshows from the database
    const airshows = await Airshow.find({
      _id: { 
        $in: [
          "66cf7aed512211556783314c", // EAA AirVenture Oshkosh
          "66cf7cb2512211556784c390", // London Airshow
          "66cf7cce512211556784dbc4"  // Royal International Air Tattoo
        ]
      }
    });

    // Iterate over each airshow and create tickets
    for (const airshow of airshows) {
      await createTicketsForAirshow(airshow);
    }

    console.log("All selected airshows updated successfully with tickets.");
  } catch (error) {
    console.error("Error updating airshows:", error);
  }
}

// Run the update
updateExistingAirshows();
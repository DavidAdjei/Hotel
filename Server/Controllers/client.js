const Hotel = require("../db/hotel");
const Restaurant = require('../db/restaurant');
const swimmingPool = require("../db/swimmingPool");
const SwimmingPool = require('../db/swimmingPool');
const { formatDate } = require("../helpers/auth");

// Add a new client
exports.addClient = async (req, res) => {
    try {
        const { name, phone, roomNumber, checkedInBy, numberOfDays, numberOfHours, amountCharged, orders} = req.body;
        const { department } = req.params;

        if (department === "hotel") {
            if (!name || !phone) {
                return res.json({ error: "Name and phone number are required" });
            } else if (!roomNumber || !amountCharged) {
                return res.json({ error: "Room number and amount charged is required" });
            } else if (!numberOfHours && !numberOfDays) {
                return res.json({ error: "Number of days or hours are required" });
            }

            const existingHotel = await Hotel.findOne();
            let hotel;

            if (!existingHotel) {
                // Create a new hotel document if none exists
                hotel = new Hotel();
            } else {
                hotel = existingHotel;
            }

            // Check if the client already exists in the hotel
            const existingClient = hotel.clients.find(client => client.phone === phone);
            if (existingClient) {
                return res.json({ message: 'Client already exists' });
            }

            // Create a new client object
            const now = new Date();
            const today = formatDate(now);

            const newClient = {
                name: name,
                phone: phone,
                history: [{
                    checkIn: {
                        date: today.date,
                        time: today.time
                    },
                    roomNumber,
                    checkedInBy: { employeeName: checkedInBy },
                    amountCharged: amountCharged
                }],
                arrivalDate: now,
                numberOfDays,
                numberOfHours,
                isCheckedIn: true
            };

            // Add the new client to the hotel's clients array
            hotel.clients.push(newClient);

            // Save the updated hotel document
            await hotel.save();

            res.status(201).json({ message: 'Client added successfully', client: newClient });
        } else if (department === "swimmingPool") {
            if (!name || !phone) {
                return res.status(400).json({ error: "Name and phone number are required" });
            }else if (!amountCharged) {
                return res.status(400).json({ error: "Amount charged is required" });
            } else if (!numberOfHours) {
                return res.status(400).json({ error: "Number of hours is required" });
            }
            
            const existingPool = await SwimmingPool.findOne();
            let pool;
            if(existingPool){
                pool = existingPool;
            } else {
                pool = new SwimmingPool()
            }

            const existingClient = pool.clients.find(client => client.phone === phone);
            if (existingClient) {
                return res.json({ message: 'Client already exists' });
            }

            const now = new Date();
            const today = formatDate(now);

            const newClient = {
                name: name,
                phone: phone,
                history: [{
                    swimStart: {
                        date: today.date,
                        time: today.time,
                    },
                    overseedBy: { employeeName: checkedInBy },
                    amountCharged: amountCharged,
                    hoursPaid: numberOfHours
                }],
                arrivalDate: now,
                isSwimming: true,
                numberOfHours: numberOfHours
            }

                
            pool.clients.push(newClient);
            await pool.save();

            res.status(201).json({ message: 'Client added successfully', client: newClient })
        } else {
            res.status(404).json({error: "Invalid Department"})
        }
        } catch (error) {
        console.error("Error adding client:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Check-in a client
exports.checkIn = async (req, res) => {
    try {
        const { clientId, roomNumber, checkedInBy, numberOfDays, numberOfHours, amountCharged } = req.body;
        const { department } = req.params;

        

        if (department === "hotel") {
            if (!clientId || !roomNumber || !checkedInBy || !amountCharged) {
                return res.status(400).json({ error: "All fields are required" });
            }else if(!numberOfHours && !numberOfDays) {
                return res.status(400).json({ error: "Number of days or hours is required" });
            }

            const hotel = await Hotel.findOne();
            
            const client = hotel.clients.find(client => client._id.toString() === clientId.toString());
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            const now = new Date();
            const today = formatDate(now);

            client.arrivalDate = now;
            client.numberOfDays = numberOfDays;
            client.numberOfHours = numberOfHours;
            client.history.push({
                checkIn: { date: today.date, time: today.time },
                roomNumber,
                checkedInBy: { employeeName: checkedInBy },
                amountCharged: amountCharged
            });
            client.isCheckedIn = true;
            await hotel.save();

            return res.status(200).json({ message: "Checked in successfully", client });
        } else if (department === "swimmingPool") {
            
            if (!clientId || !checkedInBy || !numberOfHours || !amountCharged) {
                return res.status(400).json({ error: "All fields are required" });
            }

            const pool = await SwimmingPool.findOne();

            const client = pool.clients.find(client => client._id.toString() === clientId.toString());
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            const now = new Date();
            const today = formatDate(now);

            client.arrivalDate = now;
            client.numberOfHours = numberOfHours;
            client.history.push({
                swimStart: { date: today.date, time: today.time },
                overseedBy: { employeeName: checkedInBy },
                amountCharged: amountCharged,
                hoursPaid: numberOfHours
            });
            client.isSwimming = true;
            await pool.save();

            return res.json({ message: "Checked in successfully", client });
        }else {
            res.status(404).json({error: "Invalid Department"})
        }
        
    } catch (error) {
        console.error("Error checking in client:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Check-out a client
exports.checkOut = async (req, res) => {
    try {
        const { clientId, feedback, employeeName } = req.body;
        const { department } = req.params;

        

        if (department === "hotel") {
            if (!feedback || feedback.trim() === '') {
                return res.status(400).json({ error: "Feedback and employee name are required" });  
            }

            const hotel = await Hotel.findOne();

            const client = hotel.clients.find(client => client._id.toString() === clientId.toString());
            if (!client) {
                console.log('Client Not Found')
                return res.status(404).json({ error: "Client not found" });
            }

            const now = new Date();
            const today = formatDate(now);

            // Update client details for checkout
            client.history[client.history.length - 1].checkOut = {
                date: today.date,
                time: today.time
            };
            client.arrivalDate = undefined;
            client.numberOfDays = null;
            client.numberOfHours = null;
            client.isCheckedIn = false;
            client.feedbacks.push({ feedback, date: now, employee: { employeeName } });
            await hotel.save();

            // Return success message and updated client
            return res.json({ message: "Checkout successful", client });
        } else if (department === "swimmingPool") {
            const pool = await SwimmingPool.findOne();

            const client = pool.clients.find(client => client._id.toString() === clientId.toString());
            if (!client) {
                return res.status(404).json({ error: "Client not found" });
            }

            const now = new Date();
            const today = formatDate(now);

            // Update client details for swimEnd
            client.history[client.history.length - 1].swimEnd = {
                date: today.date,
                time: today.time
            };
            client.arrivalDate = undefined;
            client.numberOfHours = null;
            client.isSwimming = false;
            await pool.save();

            // Return success message and updated client
            return res.json({ message: "Checkout successful", client });
        } else {
            res.status(404).json({error: "Invalid Department"})
        }
    } catch (error) {
        console.error("Error checking out client:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.allClients = async (req, res) => {
    try {
        const { department } = req.params;
        let organisation;
        if (department === 'hotel') {
            organisation = await Hotel.findOne();
        }else if (department === 'swimmingPool') {
            organisation = await SwimmingPool.findOne();
        } else {
            return res.status(404).json({ error: "Invalid Department" });
        }

        if (!organisation) {
            return res.status(404).json({ error: "No clients found" });
        }
        return res.status(200).json({organisation: organisation});
    } catch (error) {
        console.error("Error retrieving clients:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.updateDaysRemaining = async (req, res) => {
    try {
        const hotel = await Hotel.findOne();
        const clients = hotel.clients.filter(client => client.isCheckedIn === true);

        if (clients.length === 0) {
            return res.status(200).json({error: 'No Checked In Clients'});
        }

        for (const client of clients) {
            const currentDate = new Date();
            const checkInDate = new Date(client.arrivalDate);
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const durationInMilliseconds = (client.numberOfDays || 0) * millisecondsPerDay;
            const remainingMilliseconds = durationInMilliseconds - (currentDate - checkInDate);

            // Update number of days remaining
            if (remainingMilliseconds > 0) {
                const daysRemaining = Math.ceil(remainingMilliseconds / millisecondsPerDay);
                client.numberOfDays = daysRemaining;
            } else {
                client.numberOfDays = null;
            }
        }

        await hotel.save();
        return res.json({ message: "Days remaining updated successfully" });
    } catch (error) {
        console.error('Error updating days remaining:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.updateHoursRemaining = async (req, res) => {
    try {
        const { department } = req.params;

        if (department === "hotel") {
            const hotel = await Hotel.findOne();
            const clients = hotel.clients.filter(client => client.isCheckedIn === true);

            if (clients.length === 0) {
                return res.status(200).json({error: 'No Checked In Clients'});
            }

            for (const client of clients) {
                const currentDate = new Date();
                const checkInDate = new Date(client.arrivalDate);
                const millisecondsPerHour = 60 * 60 * 1000;
                const durationInMilliseconds = (client.numberOfHours || 0) * millisecondsPerHour;
                const remainingMilliseconds = durationInMilliseconds - (currentDate - checkInDate);

                if (remainingMilliseconds > 0) {
                    const hoursRemaining = Math.ceil(remainingMilliseconds / millisecondsPerHour);
                    client.numberOfHours = hoursRemaining;
                } else {
                    client.numberOfHours = null;
                }
            }
            await hotel.save();
            return res.json({ message: "Hours remaining updated successfully" });
        } else if (department === 'swimmingPool') {
            const pool = await SwimmingPool.findOne();
            const clients = pool.clients.filter(client => client.isSwimming === true);

            if (clients.length === 0) {
                return res.status(200).json({error: 'No Checked In Clients'});
            }

            for (const client of clients) {
                const currentDate = new Date();
                const checkInDate = new Date(client.arrivalDate);
                const millisecondsPerHour = 60 * 60 * 1000;
                const durationInMilliseconds = (client.numberOfHours || 0) * millisecondsPerHour;
                const remainingMilliseconds = durationInMilliseconds - (currentDate - checkInDate);

                if (remainingMilliseconds > 0) {
                    const hoursRemaining = Math.ceil(remainingMilliseconds / millisecondsPerHour);
                    client.numberOfHours = hoursRemaining;
                } else {
                    client.numberOfHours = null;
                }
            }
            await pool.save();
            return res.json({ message: "Hours remaining updated successfully" });
        }
    } catch (error) {
        console.error('Error updating hours remaining:', error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.feedbacks = async (req, res) => {
  try {
    const hotel = await Hotel.findOne(); // Fetch the single hotel

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const allFeedbacks = hotel.clients.reduce((feedbacks, client) => {
      client.feedbacks.forEach(feedback => {
        feedbacks.push({
          hotelId: hotel._id,
          clientId: client._id,
          feedbackId: feedback._id,
          feedback: feedback.feedback,
          date: feedback.date,
          employeeId: feedback.employee.employeeId,
          employeeName: feedback.employee.employeeName
        });
      });
      return feedbacks;
    }, []);

    res.json({feedbacks: allFeedbacks});
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Restaurant controllers
exports.getDishes = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne();
        let cusine;

        if (!restaurant) {
            cusine = new Restaurant()
        } else {
            cusine = restaurant
        }
        const dishes = cusine.dishes;
        return res.status(200).json({ dishes: dishes });
    } catch (error) {
        console.error("Error retrieving clients:", error);
    }
}

exports.addDish = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        if (!name || !price || !category || !description) {
            console.log('All Fields are required')
            return res.status(400).json({error: 'All Fields are required'})
        }
        
        const cusine = await Restaurant.findOne();
        let restaurant;

        if (!cusine) {
            restaurant = new Restaurant();
        } else {
            restaurant = cusine;
        }

        const newDish = {
            name: name,
            price: price,
            category: category,
            description: description
        }

        restaurant.dishes.push(newDish);
        await restaurant.save();

        return res.status(200).json({dish: newDish})
    } catch (err) {
        console.log("Something Happened " + err)
        return res.status(404).json({error: 'Server Error'})
    }
}

exports.placeOrder = async (req, res) => {
    const { items, totalPrice } = req.body;
    try {
        let cusine = await Restaurant.findOne();
        let restaurant;

        if (!cusine) {
            restaurant = new Restaurant();
        } else {
            restaurant = cusine;
        }

        const newOrder = {
            items: items,
            totalAmount: totalPrice,
            orderDate: new Date()
        }

        restaurant.orders.push(newOrder);
        await restaurant.save();
        console.log("Success")
        return res.status(200).json({order: newOrder})
    } catch(error) {
        console.log("Error ", error)
        return res.status(404).json({error: "Something Happened"})
    }
}

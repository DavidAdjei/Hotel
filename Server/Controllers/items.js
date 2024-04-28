const Hotel = require("../db/hotel");

exports.addItems = async (req, res) => {
  try {
    const { name, description, stock } = req.body;
    const sleep = await Hotel.findOne();
    let hotel;

    if (!sleep) {
      hotel = new Hotel()
    } else {
      hotel = sleep;
    }

    const items = hotel.items;

    // Check if product already exists
    const existingProduct = items.find(item => item.name === name);
    if (existingProduct) {
      console.log("Product already exists");
      existingProduct.set({
        description,
        stockQuantity: stock,
      });
      await hotel.save();
      return res.json({message: "Successful"});
    }
    const newProduct = hotel.items.create({
      name,
      description,
      stockQuantity: stock,
      editHistory: [],
    });
    items.push(newProduct);
    await hotel.save()
    res.json({ newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.allItems = async (req, res) => {
  try {
    const sleep = await Hotel.findOne();
    let hotel;

    if (!sleep) {
      hotel = new Hotel()
    } else {
      hotel = sleep;
    }
    const items = hotel.items;
    res.json({ items: items});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.editItem = async (req, res) => {
   try {
    const itemId = req.params.id;
    const { name, description, stock, editedBy } = req.body;
    
    // Find the hotel document
    const hotel = await Hotel.findOne();

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Find the item to edit within the hotel's items array
    const itemToEdit = hotel.items.find(item => item._id.toString() === itemId);

    if (!itemToEdit) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const originalItem = { name: itemToEdit.name, description: itemToEdit.description, stockQuantity: itemToEdit.stockQuantity };


    // Update the item properties
    itemToEdit.name = name;
    itemToEdit.description = description;
    itemToEdit.stockQuantity = stock;

    // Save the updated hotel document
    await hotel.save();

    // Create edit record
    const editRecord = {
      editedBy: { employeeName: editedBy },
      editedFields: [],
      editedAt: new Date()
     };
     

    // Compare updated fields with original item details and record changes
    // if (name !== originalItem.name) {
    //   editRecord.editedFields.push({ field: 'name', valueBefore: originalItem.name, valueAfter: name });
    // }
    // if (description !== originalItem.description) {
    //   editRecord.editedFields.push({ field: 'description', valueBefore: originalItem.description, valueAfter: description });
    // }
     if (stock === originalItem.stockQuantity) {
       console.log('Nothing edited')
      return res.json({message: 'Nothing edited'})
    }else if (stock !== originalItem.stockQuantity) {
      editRecord.editedFields.push({ field: 'Stock Quantity', valueBefore: originalItem.stockQuantity, valueAfter: stock });
      // Add edit record to item's edit history
      itemToEdit.editHistory.push(editRecord);

      // Save updated item with edit history
      await hotel.save();

      res.json({ message: 'Item updated successfully', itemToEdit });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    // Find the hotel document
    const hotel = await Hotel.findOne();

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Filter out the item to be deleted from the hotel's items array
    hotel.items = hotel.items.filter(item => item._id.toString() !== itemId);

    // Save the updated hotel document
    await hotel.save();

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


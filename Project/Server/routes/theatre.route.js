const express = require('express')
const Theatre = require('../models/theatre.model.js');
const isAuth = require('../middlewares/authMiddleware.js');
const { requirePartnerOrAdmin } = require('../middlewares/roleMiddleware.js');

const theatreRouter = express.Router(); // Route



theatreRouter.post('/add-theatre', isAuth, requirePartnerOrAdmin, async (req, res) => {
    try{
        console.log("Received theatre data:", req.body);
        // Security: Partners can only add theatres with themselves as owner
        if (req.user.role === 'partner') {
            req.body.owner = req.userId;
        }
        const newTheatre = new Theatre(req.body);
        const savedTheatre = await newTheatre.save();
        console.log("Saved theatre:", savedTheatre);
        res.send({
            success: true,
            message: "New theatre has been added!",
            data: savedTheatre
        })
    }catch(err){
        console.error("Error adding theatre:", err);
        res.send({
            success: false,
            message: err.message
        })
    }
});

// Get all theatres for Admin route (Admin only)
theatreRouter.get('/get-all-theatres', isAuth, requirePartnerOrAdmin, async (req, res) => {
    try{
        const allTheatres = await Theatre.find();
        res.send({
            success: true,
            message: "All theatres fetched!",
            data: allTheatres
        });
    }catch(err){
        res.send({
            success: false,
            message: err.message
        });
    }
});

// Get the theatres of a specific owner (Authenticated - Partner can see their own)
theatreRouter.post('/get-all-theatres-by-owner', isAuth, async (req, res) => {
    try{
        const userId = req.userId;
        const requestedOwnerId = req.body.owner;
        
        // Security: Partners can only see their own theatres, Admins can see any
        if (req.user.role === 'partner' && requestedOwnerId !== userId) {
            return res.send({
                success: false,
                message: "Access denied. You can only view your own theatres."
            });
        }
        
        console.log("Getting theatres for owner:", requestedOwnerId);
        const allTheatres = await Theatre.find({owner: requestedOwnerId});
        console.log("Found theatres:", allTheatres.length);
        res.send({
            success: true,
            message: "All theatres fetched successfully!",
            data: allTheatres
        })
    }catch(err){
        console.error("Error fetching theatres by owner:", err);
        res.send({
            success: false,
            message: err.message
        })
    }
});


// Update theatre (Partner or Admin)
theatreRouter.put('/update-theatre', isAuth, requirePartnerOrAdmin, async (req, res) => {
    try{
        const theatre = await Theatre.findById(req.body.theatreId);
        if (!theatre) {
            return res.send({
                success: false,
                message: "Theatre not found"
            });
        }
        
        // Security: Partners can only update their own theatres
        if (req.user.role === 'partner' && theatre.owner.toString() !== req.userId) {
            return res.send({
                success: false,
                message: "Access denied. You can only update your own theatres."
            });
        }
        
        await Theatre.findByIdAndUpdate(req.body.theatreId, req.body);
        // console.log(req.body.theatreId)
        res.send({
            success: true,
            message: "Theatre has been updated!"
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
})

// Delete theatre (Partner or Admin)
theatreRouter.put('/delete-theatre', isAuth, requirePartnerOrAdmin, async (req, res) => {
    try{
        const theatre = await Theatre.findById(req.body.theatreId);
        if (!theatre) {
            return res.send({
                success: false,
                message: "Theatre not found"
            });
        }
        
        // Security: Partners can only delete their own theatres
        if (req.user.role === 'partner' && theatre.owner.toString() !== req.userId) {
            return res.send({
                success: false,
                message: "Access denied. You can only delete your own theatres."
            });
        }
        
        await Theatre.findByIdAndDelete(req.body.theatreId);
        res.send({
            success: true,
            message: "The theatre has been deleted!"
        })
    }catch(err){
        res.send({
            success: false,
            message: err.message
        })
    }
});



module.exports = theatreRouter;
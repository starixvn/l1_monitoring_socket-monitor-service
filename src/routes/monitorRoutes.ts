import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    res.status(200).json("Socket Monitor Service");
});

export default router;

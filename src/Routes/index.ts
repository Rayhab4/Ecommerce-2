import { Router } from 'express';
import AuthRoutes from "./AuthRoutes"
import UserRoutes from './UserRoutes'
import CartItemRoutes from './CartItemRoutes'
import ContactRoutes from './ContactRoutes'
import OrderRoutes from './OrderRoutes'
import ProductRoutes from './ProductRoutes'
import BlogRoutes from "./BlogRoutes";



const routers = Router();
const allRoutes = [AuthRoutes,UserRoutes,OrderRoutes,ContactRoutes,CartItemRoutes,ProductRoutes,BlogRoutes];
routers.use("/api", ...allRoutes);

export { routers };
import { registerOverriddenValidators } from "@medusajs/medusa";
import {
	AdminCreateUserRequest,
	AdminUpdateUserRequest,
} from "../extend-validator/user";

registerOverriddenValidators(AdminCreateUserRequest);
registerOverriddenValidators(AdminUpdateUserRequest);

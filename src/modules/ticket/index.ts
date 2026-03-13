import { Module } from "@medusajs/framework/utils";
import TicketModuleService from "./service";

export const TICKET_MODULE = "ticketModuleService";

export default Module(TICKET_MODULE, { service: TicketModuleService });

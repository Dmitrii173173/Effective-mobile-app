export enum TicketStatus {
    NEW = "Новое",
    IN_PROGRESS = "В работе",
    COMPLETED = "Завершено",
    CANCELLED = "Отменено"
  }
  
  export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: TicketStatus;
    solution: string | null;
    cancelReason: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CreateTicketDto {
    title: string;
    description: string;
  }
  
  export interface CompleteTicketDto {
    solution: string;
  }
  
  export interface CancelTicketDto {
    cancelReason: string;
  }
  
  export interface TicketFilters {
    date?: string;
    startDate?: string;
    endDate?: string;
  }
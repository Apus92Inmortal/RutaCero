type TableShape = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: TableShape;
      debts: TableShape;
      debt_payments: TableShape;
      access_payments: TableShape;
      goals: TableShape;
      alerts: TableShape;
      strategies: TableShape;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};


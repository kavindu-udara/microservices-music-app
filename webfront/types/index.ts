export type User = {
  fname: string;
  lname: string;
  role: "USER" | "ADMIN";
  email: string;
  verified: boolean;
  id: number;
};

export type Account = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  iat: bigint;
  exp: bigint;
  role: "USER" | "ADMIN";
};

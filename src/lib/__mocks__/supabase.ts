const makeQueryBuilder = () => ({
  upsert: jest.fn().mockResolvedValue({ error: null }),
  delete: jest.fn().mockReturnValue({
    match: jest.fn().mockResolvedValue({ error: null }),
    eq: jest.fn().mockResolvedValue({ error: null }),
  }),
});

export const supabase = {
  from: jest.fn().mockImplementation(() => makeQueryBuilder()),
  auth: {
    getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
    setSession: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
};

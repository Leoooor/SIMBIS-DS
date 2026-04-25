import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./auth";

// ── Products ────────────────────────────────────────────────────────
export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setProducts(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("products_changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "products", filter: `user_id=eq.${user.id}` },
        () => fetch()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetch]);

  const addProduct = async (data) => {
    const { error } = await supabase.from("products").insert({ ...data, user_id: user.id });
    return { ok: !error, error: error?.message };
  };

  const updateProduct = async (id, data) => {
    const { error } = await supabase.from("products").update(data).eq("id", id).eq("user_id", user.id);
    return { ok: !error, error: error?.message };
  };

  const deleteProduct = async (id) => {
    const { error } = await supabase.from("products").delete().eq("id", id).eq("user_id", user.id);
    return { ok: !error, error: error?.message };
  };

  return { products, loading, addProduct, updateProduct, deleteProduct, refetch: fetch };
}

// ── Sales History ───────────────────────────────────────────────────
export function useSalesHistory() {
  const { user } = useAuth();
  const [salesHistory, setSalesHistory] = useState([]);
  const [loading, setLoading]           = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("sales_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });
    setSalesHistory(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("sales_changes")
      .on("postgres_changes",
        { event: "*", schema: "public", table: "sales_history", filter: `user_id=eq.${user.id}` },
        () => fetch()
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, fetch]);

  const addSales = async (data) => {
    const { error } = await supabase.from("sales_history").insert({ ...data, user_id: user.id });
    return { ok: !error, error: error?.message };
  };

  const updateSales = async (id, data) => {
    const { error } = await supabase.from("sales_history").update(data).eq("id", id).eq("user_id", user.id);
    return { ok: !error, error: error?.message };
  };

  const deleteSales = async (id) => {
    const { error } = await supabase.from("sales_history").delete().eq("id", id).eq("user_id", user.id);
    return { ok: !error, error: error?.message };
  };

  return { salesHistory, loading, addSales, updateSales, deleteSales, refetch: fetch };
}

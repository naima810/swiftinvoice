import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request, context) {
  const { params } = context;
  const { id } = await params;

  const { data, error } = await supabase
    .from("invoices")
    .select(
      `
      *,
      clients(*),
      invoice_items(*),
      invoice_reminders(*)
    `,
    )
    .eq("id", id)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function PATCH(req, { params }) {
  const { id } = await params;

  const body = await req.json();

  const { data, error } = await supabase
    .from("invoices")
    .update({
      due_date: body.dueDate,
      currency: body.currency,
      notes: body.notes,
      tax: body.tax,
      discount: body.discount,
      total: body.total,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

import { supabase } from "@/integrations/supabase/client";

export interface ElementPosition {
  x: number;
  y: number;
}
export type TextAlign = "left" | "center" | "right";
export type VerticalAlign = "top" | "center" | "bottom";
export interface LabelTemplate {
  id: string;
  name: string;
  labelWidth: number;
  labelHeight: number;
  columns: number;
  fontSizeProduct: number;
  fontSizePrice: number;
  fontSizeCode: number;
  productPos: ElementPosition;
  pricePos: ElementPosition;
  codePos: ElementPosition;
  barcodePos: ElementPosition;
  barcodeWidth: number;
  barcodeHeight: number;
  productMaxWidth: number;
  productMaxHeight: number;
  priceWidth: number;
  priceHeight: number;
  codeWidth: number;
  codeHeight: number;
  productAlign?: TextAlign;
  priceAlign?: TextAlign;
  codeAlign?: TextAlign;
  productVerticalAlign?: VerticalAlign;
  priceVerticalAlign?: VerticalAlign;
  codeVerticalAlign?: VerticalAlign;
  productOffsetY?: number;
  priceOffsetY?: number;
  codeOffsetY?: number;
  productMaxLines?: number;
  priceMaxLines?: number;
  codeMaxLines?: number;
  productBold?: boolean;
  priceBold?: boolean;
  codeBold?: boolean;
  productText?: string;
  priceText?: string;
  codeText?: string;
  barcodeText?: string;
  hasPromoPrice?: boolean;
  priceDeText?: string;
  priceDePos?: ElementPosition;
  priceDeWidth?: number;
  priceDeHeight?: number;
  fontSizePriceDe?: number;
}

function createTemplate(base: Partial<LabelTemplate> = {}): LabelTemplate {
  return {
    id: "default-40x25-1col",
    name: "40×25mm 1 Coluna",
    labelWidth: 40,
    labelHeight: 25,
    columns: 1,
    fontSizeProduct: 6,
    fontSizePrice: 10,
    fontSizeCode: 7,
    productPos: { x: 1, y: 8.5 },
    pricePos: { x: 1, y: 19.5 },
    codePos: { x: 23.5, y: 19.5 },
    barcodePos: { x: 1, y: 1 },
    barcodeWidth: 38,
    barcodeHeight: 6.5,
    productMaxWidth: 38,
    productMaxHeight: 8,
    priceWidth: 20,
    priceHeight: 4.5,
    codeWidth: 14.5,
    codeHeight: 4.5,
    productAlign: "left",
    priceAlign: "left",
    codeAlign: "right",
    productVerticalAlign: "top",
    priceVerticalAlign: "bottom",
    codeVerticalAlign: "bottom",
    productOffsetY: 0,
    priceOffsetY: 0,
    codeOffsetY: 0,
    productMaxLines: 3,
    priceMaxLines: 1,
    codeMaxLines: 1,
    productBold: true,
    priceBold: true,
    codeBold: false,
    productText: "Nome do Produto",
    priceText: "R$9,99",
    codeText: "RZ001",
    barcodeText: "7891234567890",
    ...base,
  };
}

export function getDefaultTemplates(): LabelTemplate[] {
  return [
    createTemplate(),
    createTemplate({
      id: "default-40x25-2col",
      name: "40×25mm 2 Colunas",
      labelWidth: 40,
      labelHeight: 25,
      columns: 2,
      fontSizeProduct: 5,
      fontSizePrice: 8,
      fontSizeCode: 6,
      barcodePos: { x: 0.5, y: 1 },
      barcodeWidth: 19,
      barcodeHeight: 6,
      productPos: { x: 0.5, y: 8 },
      productMaxWidth: 19,
      productMaxHeight: 7.5,
      productMaxLines: 3,
      productBold: true,
      pricePos: { x: 0.5, y: 19.5 },
      priceWidth: 11,
      priceHeight: 4,
      priceBold: true,
      codePos: { x: 13, y: 19.5 },
      codeWidth: 6.5,
      codeHeight: 4,
      codeBold: false,
      productVerticalAlign: "top",
      priceVerticalAlign: "bottom",
      codeVerticalAlign: "bottom",
      priceAlign: "left",
      codeAlign: "right",
    }),
    createTemplate({
      id: "default-40x40-promo",
      name: "40x40mm",
      labelWidth: 40,
      labelHeight: 40,
      columns: 1,
      hasPromoPrice: true,
      fontSizeProduct: 7,
      fontSizePrice: 12,
      fontSizePriceDe: 6,
      fontSizeCode: 7,
      barcodePos: { x: 1, y: 26 },
      barcodeWidth: 38,
      barcodeHeight: 8,
      productPos: { x: 1, y: 1 },
      productMaxWidth: 38,
      productMaxHeight: 10,
      productMaxLines: 2,
      productBold: true,
      productAlign: "left",
      productVerticalAlign: "top",
      pricePos: { x: 19, y: 12 },
      priceWidth: 18,
      priceHeight: 12,
      priceBold: true,
      priceAlign: "left",
      priceVerticalAlign: "top",
      priceDePos: { x: 1, y: 12 },
      priceDeWidth: 14,
      priceDeHeight: 10,
      codePos: { x: 1, y: 35 },
      codeWidth: 38,
      codeHeight: 4,
      codeAlign: "center",
      codeVerticalAlign: "top",
      codeBold: false,
      priceDeText: "R$0,00",
      priceText: "R$0,00",
    }),
  ];
}

export function getDefaultTemplate(): LabelTemplate {
  return getDefaultTemplates()[0];
}

export async function loadTemplatesFromDb(): Promise<LabelTemplate[]> {
  try {
    const { data, error } = await (supabase as any)
      .from("label_templates")
      .select("id, name, template_data, is_default")
      .order("name");
    if (error) throw error;
    if (data && data.length > 0)
      return data.map((row: any) => ({
        ...getDefaultTemplate(),
        ...(row.template_data as Partial<LabelTemplate>),
        id: row.id,
        name: row.name,
      }));
  } catch (e) {
    console.warn("Failed to load templates from DB, using defaults", e);
  }
  return getDefaultTemplates();
}

export function getActiveTemplateId(): string {
  return localStorage.getItem("active-template-id") || "default-40x25-1col";
}

export function setActiveTemplateId(id: string) {
  localStorage.setItem("active-template-id", id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

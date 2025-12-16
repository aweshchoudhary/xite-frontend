import { Field, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { IMicrositeBranding } from "@microsite-cms/common/services/db/types/interfaces";
import { Palette, Image as ImageIcon, Type } from "lucide-react";
import Image from "next/image";

interface RecordViewBrandingProps {
  branding?: IMicrositeBranding;
}

export default function RecordViewBranding({
  branding,
}: RecordViewBrandingProps) {
  if (!branding) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">
          <Palette className="size-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">No branding information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Branding</h2>
      </header>

      <div className="w-full relative p-8 space-y-6 bg-background shadow-xs rounded-xl border border-border/50">
        {/* Logo and Favicon */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Assets</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="branding-logo">Logo</FieldLabel>
                {branding.logo ? (
                  <div className="max-w-xs p-3 aspect-square h-auto object-cover bg-muted rounded-lg border">
                    <Image
                      src={branding.logo.replace("http://localhost:3000", "")}
                      alt="Logo"
                      width={200}
                      height={200}
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <Input
                    id="branding-logo"
                    value="No logo uploaded"
                    readOnly
                    className="bg-muted"
                  />
                )}
              </Field>
            </FieldGroup>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="branding-favicon">Favicon</FieldLabel>
                {branding.favicon ? (
                  <div className="max-w-xs p-3 aspect-square h-auto object-cover bg-muted rounded-lg border">
                    <Image
                      src={branding.favicon.replace("http://localhost:3000", "")}
                      alt="Favicon"
                      width={32}
                      height={32}
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <Input
                    id="branding-favicon"
                    value="No favicon uploaded"
                    readOnly
                    className="bg-muted"
                  />
                )}
              </Field>
            </FieldGroup>
          </div>
        </div>

        {/* Colors */}
        {branding.colors && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Colors</h3>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-primary">Primary Color</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor: branding.colors.primary || "#000000",
                      }}
                    />
                    <Input
                      id="color-primary"
                      value={branding.colors.primary || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-primary-foreground">
                    Primary Foreground
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor:
                          branding.colors.primary_foreground || "#ffffff",
                      }}
                    />
                    <Input
                      id="color-primary-foreground"
                      value={branding.colors.primary_foreground || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-secondary">Secondary Color</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor: branding.colors.secondary || "#000000",
                      }}
                    />
                    <Input
                      id="color-secondary"
                      value={branding.colors.secondary || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-secondary-foreground">
                    Secondary Foreground
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor:
                          branding.colors.secondary_foreground || "#ffffff",
                      }}
                    />
                    <Input
                      id="color-secondary-foreground"
                      value={branding.colors.secondary_foreground || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-accent">Accent Color</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor: branding.colors.accent || "#000000",
                      }}
                    />
                    <Input
                      id="color-accent"
                      value={branding.colors.accent || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-accent-foreground">
                    Accent Foreground
                  </FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor:
                          branding.colors.accent_foreground || "#ffffff",
                      }}
                    />
                    <Input
                      id="color-accent-foreground"
                      value={branding.colors.accent_foreground || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="color-border">Border Color</FieldLabel>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-border"
                      style={{
                        backgroundColor: branding.colors.border || "#000000",
                      }}
                    />
                    <Input
                      id="color-border"
                      value={branding.colors.border || ""}
                      readOnly
                      className="bg-muted flex-1"
                    />
                  </div>
                </Field>
              </FieldGroup>
            </div>
          </div>
        )}

        {/* Fonts */}
        {branding.fonts && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-4">
              <Type className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">Typography</h3>
            </div>
            <div className="grid grid-cols-1 gap-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="font-family">Font Family</FieldLabel>
                  <Input
                    id="font-family"
                    value={branding.fonts.family || ""}
                    readOnly
                    className="bg-muted"
                  />
                </Field>
              </FieldGroup>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


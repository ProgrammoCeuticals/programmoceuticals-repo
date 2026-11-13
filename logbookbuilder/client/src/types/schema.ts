export type ColumnDataType =
  | 'text' | 'long_text' | 'integer' | 'decimal' | 'date' | 'time' | 'datetime'
  | 'boolean' | 'dropdown' | 'multi_select' | 'user' | 'person' | 'reference'
  | 'calculated' | 'file' | 'image' | 'signature'

export type ColumnBehavior = 'independent' | 'linked' | 'synchronized' | 'calculated'

export type LogStatus = 'draft' | 'active' | 'archived'

export type RecordStatus = 'active' | 'corrected' | 'voided' | 'archived'

import React, { useId, useRef, useState } from 'react';
import { useMessages } from '../internal/messages';
import { useDrop } from 'react-aria';
import { useDefaults, slot, ClassNames } from '../internal/defaults';

export interface UploadFile {
  /** Stable id for keys and updates. */
  id: string;
  file: File;
  /** 0–100 while uploading. Leave undefined when you don't track progress. */
  progress?: number;
  status?: 'queued' | 'uploading' | 'done' | 'error';
  /** Shown under the name when status is `error`. */
  error?: string;
}

export interface FileRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
  message: string;
}

export interface FileUploadProps {
  label?: React.ReactNode;
  /** Files in the list (controlled). Update `progress` / `status` as uploads run. */
  files?: UploadFile[];
  defaultFiles?: UploadFile[];
  /** Whole list after adding or removing. */
  onChange?: (files: UploadFile[]) => void;
  /** Just the newly accepted files: start uploads here. */
  onAdd?: (added: UploadFile[]) => void;
  onRemove?: (file: UploadFile) => void;
  /** Files that failed `accept`, `maxSize` or `maxFiles`. Default messages are shown under the zone. */
  onReject?: (rejected: FileRejection[]) => void;
  /** Like the input attribute: "image/*,.pdf". */
  accept?: string;
  multiple?: boolean;
  /** Bytes. */
  maxSize?: number;
  maxFiles?: number;
  /** Line under the main prompt. Default lists accepted types and size. */
  hint?: React.ReactNode;
  /** Main prompt. Default "Drop files here or browse". */
  prompt?: React.ReactNode;
  /** Image thumbnails in the list. Default `true`. */
  previews?: boolean;
  disabled?: boolean;
  /** Submit the files with a regular form. */
  name?: string;
  className?: string;
  classNames?: ClassNames<'root' | 'label' | 'zone' | 'list' | 'item' | 'errors'>;
}

/** 1536 → "1.5 KB". */
export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  const u = ['KB', 'MB', 'GB'];
  let i = -1;
  do {
    n /= 1024;
    i++;
  } while (n >= 1024 && i < u.length - 1);
  return `${n < 10 ? n.toFixed(1) : Math.round(n)} ${u[i]}`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return accept.split(',').some((raw) => {
    const a = raw.trim().toLowerCase();
    if (!a) return false;
    if (a.startsWith('.')) return name.endsWith(a);
    if (a.endsWith('/*')) return type.startsWith(a.slice(0, -1));
    return type === a;
  });
}

let seq = 0;
const makeId = () => `f${Date.now().toString(36)}${(seq++).toString(36)}`;

function Thumb({ file }: { file: File }) {
  const [url, setUrl] = useState<string | null>(null);
  React.useEffect(() => {
    if (!file.type.startsWith('image/') || typeof URL.createObjectURL !== 'function') return;
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url ? (
    <img className="sp-file-upload__thumb" src={url} alt="" onError={() => setUrl(null)} />
  ) : (
    <span className="sp-file-upload__thumb" data-ext={file.name.split('.').pop()?.slice(0, 4).toUpperCase()} aria-hidden="true" />
  );
}

/**
 * Drag and drop or browse for files, with type and size limits checked as
 * files arrive. Rejected files come with a clear reason, images can show
 * previews, and everything works from the keyboard.
 *
 * Drop files on the zone or browse. Checks type, size and count
 * before accepting, lists files with thumbnails, progress and errors, and
 * lets people remove them. Uploading is yours: start it in `onAdd`, then
 * feed `progress` / `status` back through `files`.
 *
 * The zone is a real button (keyboard and screen readers), and drag-and-drop
 * uses React Aria's `useDrop`, which also accepts keyboard and screen-reader drops.
 *
 * Style hooks: `.sp-file-upload`, `__zone[data-drop-target][data-invalid]`, `__item[data-status]`, `__progress`.
 */
export function FileUpload(inProps: FileUploadProps) {
  const props = useDefaults('FileUpload', inProps) as FileUploadProps;
  const m = useMessages();
  const { label, accept, multiple = true, maxSize, maxFiles, previews = true, disabled, name, className, classNames } = props;
  const [inner, setInner] = useState<UploadFile[]>(props.defaultFiles ?? []);
  const files = props.files ?? inner;
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  const setFiles = (next: UploadFile[]) => {
    if (props.files === undefined) setInner(next);
    props.onChange?.(next);
  };

  const add = (list: File[]) => {
    const ok: UploadFile[] = [];
    const bad: FileRejection[] = [];
    const room = maxFiles !== undefined ? Math.max(0, maxFiles - files.length) : Infinity;
    for (const f of multiple ? list : list.slice(0, 1)) {
      if (!matchesAccept(f, accept)) bad.push({ file: f, reason: 'type', message: m.fileTypeRejected(f.name) });
      else if (maxSize !== undefined && f.size > maxSize) bad.push({ file: f, reason: 'size', message: m.fileTooLarge(f.name, formatBytes(maxSize)) });
      else if (ok.length >= room) bad.push({ file: f, reason: 'count', message: m.tooManyFiles(f.name, m.num(maxFiles!)) });
      else ok.push({ id: makeId(), file: f, status: 'queued' });
    }
    setRejected(bad);
    if (bad.length) props.onReject?.(bad);
    if (ok.length) {
      setFiles(multiple ? [...files, ...ok] : ok);
      props.onAdd?.(ok);
    }
  };

  const { dropProps, isDropTarget } = useDrop({
    ref: zoneRef,
    isDisabled: disabled,
    async onDrop(e) {
      const got: File[] = [];
      for (const item of e.items) if (item.kind === 'file') got.push(await item.getFile());
      add(got);
    },
  });

  const hint =
    props.hint ??
    [accept && accept.split(',').map((a) => a.trim().replace(/^\./, '').replace('/*', '').toUpperCase()).join(', '), maxSize !== undefined && m.upTo(formatBytes(maxSize)), maxFiles !== undefined && m.maxFiles(m.num(maxFiles))]
      .filter(Boolean)
      .join(' · ');

  return (
    <div className={slot('sp-file-upload', classNames, 'root', className)} data-disabled={disabled || undefined}>
      {label && (
        <span id={`${id}-label`} className={slot('sp-file-upload__label', classNames, 'label')}>
          {label}
        </span>
      )}
      <button
        {...dropProps}
        ref={zoneRef}
        type="button"
        disabled={disabled}
        aria-labelledby={label ? `${id}-label ${id}-prompt` : `${id}-prompt`}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={slot('sp-file-upload__zone', classNames, 'zone')}
        data-drop-target={isDropTarget || undefined}
        data-invalid={rejected.length > 0 || undefined}
        onClick={() => inputRef.current?.click()}
      >
        <svg className="sp-file-upload__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" />
          <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </svg>
        <span id={`${id}-prompt`} className="sp-file-upload__prompt">
          {props.prompt ?? (
            <>
              {m.dropFiles(multiple)} <u>{m.browse}</u>
            </>
          )}
        </span>
        {hint && (
          <span id={`${id}-hint`} className="sp-file-upload__hint">
            {hint}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          add(Array.from(e.target.files ?? []));
          if (!name) e.target.value = '';
        }}
      />
      {rejected.length > 0 && (
        <ul className={slot('sp-file-upload__errors', classNames, 'errors')} role="alert">
          {rejected.map((r, i) => (
            <li key={i}>{r.message}</li>
          ))}
        </ul>
      )}
      {files.length > 0 && (
        <ul className={slot('sp-file-upload__list', classNames, 'list')} aria-label={m.files}>
          {files.map((f) => (
            <li key={f.id} className={slot('sp-file-upload__item', classNames, 'item')} data-status={f.status}>
              {previews && <Thumb file={f.file} />}
              <div className="sp-file-upload__meta">
                <span className="sp-file-upload__name" title={f.file.name}>
                  {f.file.name}
                </span>
                <span className="sp-file-upload__detail">
                  {f.status === 'error' ? f.error ?? m.uploadFailed : f.status === 'uploading' && f.progress !== undefined ? `${Math.round(f.progress)}% · ${formatBytes(f.file.size)}` : formatBytes(f.file.size)}
                </span>
                {f.status === 'uploading' && (
                  <span
                    className="sp-file-upload__progress"
                    role="progressbar"
                    aria-label={m.uploading(f.file.name)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={f.progress !== undefined ? Math.round(f.progress) : undefined}
                    style={{ '--sp-progress': `${f.progress ?? 30}%` } as React.CSSProperties}
                    data-indeterminate={f.progress === undefined || undefined}
                  />
                )}
              </div>
              {f.status === 'done' && (
                <svg className="sp-file-upload__done" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-label={m.uploaded} role="img">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
              <button
                type="button"
                className="sp-file-upload__remove"
                aria-label={m.remove(f.file.name)}
                disabled={disabled}
                onClick={() => {
                  setFiles(files.filter((x) => x.id !== f.id));
                  props.onRemove?.(f);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

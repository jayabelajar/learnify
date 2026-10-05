import { Award, CheckCircle2 } from 'lucide-react';
import { Panel } from '../../components/common/Panel';

export function CertificateDetail({ certificate, onBack }: { certificate: any; onBack: () => void }) {
  return (
    <section className="space-y-6">
      <button className="text-sm font-semibold text-brand-600 hover:text-brand-700" onClick={onBack}>Back to certificates</button>
      <Panel>
        <div className="rounded-xl border border-brand-100 bg-brand-50 p-8 text-center">
          <Award className="mx-auto h-14 w-14 text-brand-600" />
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-700">Certificate of Completion</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{certificate.courseTitle}</h1>
          <p className="mt-3 text-sm text-slate-600">Awarded to <span className="font-bold">{certificate.studentName}</span></p>
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-white p-4 text-left shadow-sm">
            <Info label="Certificate ID" value={certificate.certificateId} />
            <Info label="Issued At" value={certificate.issuedAt} />
            <Info label="Status" value={certificate.status} />
          </div>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            Verified by Learnify
          </div>
        </div>
      </Panel>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
      <span className="text-xs font-semibold uppercase text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  );
}

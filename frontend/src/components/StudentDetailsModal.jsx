const DetailItem = ({ label, value, tone = 'default' }) => {
  const toneClasses = {
    default: 'bg-slate-50 text-slate-900 ring-slate-200',
    success: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-800 ring-amber-200',
    info: 'bg-sky-50 text-sky-800 ring-sky-200',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </label>
      <p
        className={`mt-2 inline-flex max-w-full rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${toneClasses[tone] || toneClasses.default}`}
      >
        {value ?? '-'}
      </p>
    </div>
  )
}

const BadgeItem = ({ label, value }) => {
  const normalizedValue = String(value ?? '-').toLowerCase()
  const isPositive = ['yes', 'true', '1'].includes(normalizedValue)
  const isNegative = ['no', 'false', '0'].includes(normalizedValue)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <span
        className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${
          isPositive
            ? 'bg-emerald-50 text-emerald-800 ring-emerald-200'
            : isNegative
              ? 'bg-rose-50 text-rose-800 ring-rose-200'
              : 'bg-slate-50 text-slate-800 ring-slate-200'
        }`}
      >
        {value ?? '-'}
      </span>
    </div>
  )
}

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl bg-[#24364a] p-4 text-white shadow-sm">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{label}</p>
    <p className="mt-2 text-2xl font-bold">{value ?? '-'}</p>
  </div>
)

const StudentDetailsModal = ({ student, onClose }) => {
  const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student'

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/55 p-3 sm:items-center sm:p-4">
      <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl ring-1 ring-black/10 sm:max-h-[92vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#24364a] px-5 py-4 text-white sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Student Details</p>
            <h3 className="mt-1 text-xl font-bold sm:text-2xl">{fullName}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition hover:bg-white/15"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr] xl:items-stretch">
              <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Overview</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#24364a] px-3 py-1.5 text-sm font-semibold text-white">
                    ID {student.id ?? '-'}
                  </span>
                  <span className="rounded-full bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800 ring-1 ring-sky-200">
                    {student.school ?? '-'}
                  </span>
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
                    Age {student.age ?? '-'}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 grid-cols-2 xl:grid-cols-4">
                  <StatCard label="G1" value={student.g1 * 5} />
                  <StatCard label="G2" value={student.g2 * 5} />
                  <StatCard label="Absences" value={student.absences} />
                  <StatCard label="Failures" value={student.failures} />
                </div>
              </div>

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <DetailItem label="First Name" value={student.firstName} tone="info" />
                <DetailItem label="Last Name" value={student.lastName} tone="info" />
                <DetailItem label="Sex" value={student.sex} />
                <DetailItem label="Address" value={student.address} />
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-4 lg:gap-6 xl:grid-cols-2">
            <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Identity</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Family Size" value={student.famsize} />
                <DetailItem label="Parent Status" value={student.pstatus} />
                <DetailItem label="School" value={student.school} />
                <DetailItem label="Age" value={student.age} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Family Background</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Mother Education" value={student.medu} />
                <DetailItem label="Father Education" value={student.fedu} />
                <DetailItem label="Mother Job" value={student.mjob} />
                <DetailItem label="Father Job" value={student.fjob} />
                <DetailItem label="Reason" value={student.reason} />
                <DetailItem label="Guardian" value={student.guardian} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Study Habits</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Travel Time" value={student.traveltime} />
                <DetailItem label="Study Time" value={student.studytime} />
                <DetailItem label="School Support" value={student.schoolsup} tone="success" />
                <DetailItem label="Family Support" value={student.famsup} tone="success" />
                <BadgeItem label="Paid Classes" value={student.paid} />
                <BadgeItem label="Activities" value={student.activities} />
                <BadgeItem label="Nursery" value={student.nursery} />
                <BadgeItem label="Higher Education" value={student.higher} />
                <BadgeItem label="Internet" value={student.internet} />
                <BadgeItem label="Romantic" value={student.romantic} />
              </div>
            </section>

            <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Lifestyle & Performance</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailItem label="Family Relation" value={student.famrel} />
                <DetailItem label="Free Time" value={student.freetime} />
                <DetailItem label="Go Out" value={student.goout} />
                <DetailItem label="Weekday Alcohol" value={student.dalc} tone="warning" />
                <DetailItem label="Weekend Alcohol" value={student.walc} tone="warning" />
                <DetailItem label="Health" value={student.health} tone="success" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetailsModal

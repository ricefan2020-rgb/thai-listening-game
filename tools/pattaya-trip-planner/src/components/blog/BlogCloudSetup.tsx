export function BlogCloudSetup() {
  return (
    <div className="xhs-cloud-setup">
      <p className="text-sm font-semibold text-stone-800">啟用雲端廣場（Supabase 免費方案即可）</p>
      <p className="mt-1 text-xs text-stone-500">
        個人旅遊筆記用量通常在 Free 額度內，無需付費；不設定也能用本機長連結分享。
      </p>
      <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-stone-600">
        <li>
          至{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-teal-800 underline"
          >
            supabase.com
          </a>{' '}
          建立專案
        </li>
        <li>
          SQL Editor 執行{' '}
          <code className="rounded bg-stone-100 px-1 text-xs">tools/pattaya-trip-planner/supabase/schema.sql</code>
        </li>
        <li>Authentication → Providers → 開啟 <strong>Anonymous</strong></li>
        <li>
          複製 Project URL 與 anon key 到專案根目錄{' '}
          <code className="rounded bg-stone-100 px-1 text-xs">.env.local</code>（見{' '}
          <code className="rounded bg-stone-100 px-1 text-xs">.env.example</code>）
        </li>
        <li>重新執行 <code className="rounded bg-stone-100 px-1 text-xs">npm run pattaya:dev</code></li>
      </ol>
    </div>
  )
}

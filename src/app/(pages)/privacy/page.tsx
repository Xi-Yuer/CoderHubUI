import React from "react";

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">
        隐私政策
      </h1>
      <p className="text-sm text-gray-500 mb-6">生效日期：2025年4月8日</p>

      <p className="mb-6">
        欢迎使用 <strong>Coderhub</strong>
        （以下简称“本平台”）。我们高度重视用户的隐私与数据安全。为了遵守相关法律法规（包括中国《个人信息保护法》与欧盟《通用数据保护条例》），并保障您的合法权益，我们制定了本隐私政策。
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          一、我们收集的信息
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>账户信息：</strong>如昵称、头像、邮箱等登录注册信息。
          </li>
          <li>
            <strong>使用数据：</strong>
            浏览记录、搜索关键词、发帖、评论、点赞等社区行为数据。
          </li>
          <li>
            <strong>技术信息：</strong>IP
            地址、设备类型、浏览器、操作系统、访问时间等。
          </li>
          <li>
            <strong>Cookie 与本地存储：</strong>用于保持会话状态与记录用户偏好。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          二、我们如何使用信息
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>用于提供、优化和维护平台功能。</li>
          <li>为用户个性化推荐内容、服务或功能。</li>
          <li>保障平台安全性和运营稳定性。</li>
          <li>满足法律法规、监管或合规要求。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          三、信息共享与披露
        </h2>
        <p className="mb-4">我们不会将您的信息出售。仅在以下情形下共享：</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>征得您的明确同意。</li>
          <li>
            与合法合规的第三方服务供应商合作（如云服务、图像存储、内容审核）。
          </li>
          <li>依据法律法规或监管机构的强制要求。</li>
          <li>在业务合并、收购或资产转让等场景中。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          四、信息存储与安全
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>通过加密传输、访问控制等技术手段保护数据安全。</li>
          <li>数据存储位置符合相关数据合规规定（如中国境内、GDPR 区域等）。</li>
          <li>一旦发生安全事件，我们将依法及时通知用户。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          五、您的权利
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>您可访问、更新、更正您的账户信息。</li>
          <li>您可随时申请删除账户或撤回授权。</li>
          <li>您有权关闭 Cookie 收集或提交数据访问/导出请求。</li>
          <li>如有投诉或举报，可联系 contact@xiyuer.club。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          六、第三方服务
        </h2>
        <p className="text-gray-700">
          本平台可能包含第三方服务或跳转链接（如 GitHub、YouTube、Google
          登录等），这些服务由第三方独立运营，其隐私政策将另行适用。我们建议您在使用前查阅相关政策。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          七、隐私政策更新
        </h2>
        <p className="text-gray-700">
          我们可能根据业务需要或法律变动不定期更新本隐私政策。重大变更将通过平台公告或弹窗提醒您查阅最新版本。
        </p>
      </section>

      <footer className="text-sm text-gray-500 pt-6 border-t border-gray-200">
        如您对本隐私政策有任何疑问或建议，请通过邮箱{" "}
        <a
          href="mailto:214380963@qq.com"
          className="text-blue-600 underline"
        >
          2214380963@qq.com
        </a>{" "}
        与我们联系。
      </footer>
    </main>
  );
}

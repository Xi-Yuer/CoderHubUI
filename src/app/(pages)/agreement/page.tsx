import React from "react";

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">
        用户协议
      </h1>
      <p className="text-sm text-gray-500 mb-6">生效日期：2025年4月8日</p>

      <p className="mb-6">
        欢迎您注册并使用 <strong>Coderhub</strong>
        （以下简称“本平台”）。本协议是您与本平台之间关于注册、登录、使用各项服务的法律协议。在使用平台服务前，请务必认真阅读并充分理解所有条款内容。一旦您注册或使用本平台，即表示您已接受并同意本协议的全部条款。
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          一、用户资格
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            您需具备完全民事行为能力，若为未成年人，请在监护人指导下使用本平台。
          </li>
          <li>您保证注册信息真实、准确、合法，且未冒用他人身份。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          二、用户权利与义务
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            用户有权在遵守本协议的前提下使用平台的技术、社区、内容等服务。
          </li>
          <li>
            不得以任何方式干扰平台正常运营，不得从事攻击性、违法或破坏性行为。
          </li>
          <li>用户对其账户和行为承担全部法律责任。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          三、内容管理与社区规范
        </h2>
        <p className="text-gray-700 mb-2">
          用户应对所发布的内容（如文章、评论、代码等）承担全部责任，不得包含以下内容：
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>违法违规、淫秽色情、暴力恐怖、诈骗信息等</li>
          <li>恶意攻击、散播谣言、人身攻击或侮辱行为</li>
          <li>侵犯第三方合法权益的内容（如版权、名誉、隐私等）</li>
        </ul>
        <p className="text-gray-700 mt-4">
          对违规内容，平台有权不经通知即行删除，并视情节采取限权、封禁账号等措施。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          四、知识产权声明
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            平台中所有原创内容、页面设计、代码结构等均归本平台及相关权利人所有，受法律保护。
          </li>
          <li>
            用户发布的原创内容版权归属作者本人，同时授予平台全球范围内的免费、非独占、可转授权的使用权。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          五、免责声明
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>用户在平台发布的内容仅代表其个人观点，与平台立场无关。</li>
          <li>因用户行为或内容引发的纠纷、责任由用户自行承担。</li>
          <li>
            平台将尽力保障服务安全与稳定，但不对因不可抗力导致的服务中断、数据丢失承担责任。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          六、协议变更与终止
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            本平台有权根据运营需要不定期修改本协议，并通过站内通知或公告方式发布。
          </li>
          <li>
            若用户不同意修改内容，可停止使用服务；继续使用即视为接受更新条款。
          </li>
          <li>若用户严重违反本协议，平台有权中止或终止服务并依法追究责任。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          七、法律适用与争议解决
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>本协议的签订、履行及解释均适用中华人民共和国法律。</li>
          <li>
            因本协议引起的争议，双方应首先友好协商解决，协商不成的，提交平台所在地法院诉讼处理。
          </li>
        </ul>
      </section>

      <footer className="text-sm text-gray-500 pt-6 border-t border-gray-200">
        如您对本用户协议有任何疑问或建议，请通过邮箱{" "}
        <a
          href="mailto:contact@xiyuer.club"
          className="text-blue-600 underline"
        >
          2214380963@qq.com
        </a>{" "}
        与我们联系。
      </footer>
    </main>
  );
}

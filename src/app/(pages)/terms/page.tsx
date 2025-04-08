import React from "react";

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-8">
        服务条款
      </h1>
      <p className="text-sm text-gray-500 mb-6">生效日期：2025年4月8日</p>

      <p className="mb-6">
        欢迎您使用 <strong>Coderhub</strong>{" "}
        技术社区（以下简称“本平台”）。在使用平台提供的任何服务之前，请您务必仔细阅读以下服务条款。一旦您注册、访问或使用本平台，即视为您已同意本条款的全部内容。
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          一、账号注册与管理
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>用户应提供真实、合法、有效的注册信息。</li>
          <li>用户对其账户下的所有活动和操作负责，不得将账号借予他人使用。</li>
          <li>若发现异常使用、账户被盗等问题，应立即通知平台。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          二、用户行为规范
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            不得发布、传输任何违反法律法规、公序良俗或侵犯他人权利的内容。
          </li>
          <li>禁止任何形式的垃圾信息、恶意灌水、攻击性言论或广告营销行为。</li>
          <li>用户应尊重他人劳动成果，禁止抄袭、剽窃、未经授权转载。</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          三、内容版权与授权
        </h2>
        <p className="text-gray-700 mb-2">
          用户在平台发布的内容（包括但不限于文字、图像、代码、评论等）保留原始作者的版权。
        </p>
        <p className="text-gray-700">
          用户同意授予本平台在全球范围内的非独占、可转授权、免费的使用权，用于内容展示、推荐、传播与备份。
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          四、服务变更与中止
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            本平台保留随时修改、暂停或终止部分或全部服务的权利，恕不另行通知。
          </li>
          <li>
            如用户违反法律法规或本协议约定，平台有权限制、冻结或终止其账户使用。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          五、免责声明
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            本平台为用户提供技术信息与交流环境，不对用户发布的内容承担保证或责任。
          </li>
          <li>
            因不可抗力或平台无法控制的原因导致服务中断或数据丢失，本平台不承担赔偿责任。
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          六、法律适用与争议解决
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>本条款适用中华人民共和国法律。</li>
          <li>
            因本服务条款引起的任何争议，双方应友好协商解决；协商不成的，提交平台运营方所在地法院诉讼处理。
          </li>
        </ul>
      </section>

      <footer className="text-sm text-gray-500 pt-6 border-t border-gray-200">
        如您对本服务条款有任何疑问，请通过邮箱{" "}
        <a
          href="mailto:214380963@qq.com"
          className="text-blue-600 underline"
        >
          214380963@qq.com
        </a>{" "}
        联系我们。
      </footer>
    </main>
  );
}

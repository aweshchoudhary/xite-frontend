export default function MicrositeAdditionalFieldsView({
  top_desc,
  bottom_desc,
}: {
  top_desc: string;
  bottom_desc: string;
}) {
  return top_desc || bottom_desc ? (
    <div>
      <hr />
      <h2 className="my-5">Microsite Section Fields (Optional)</h2>
      {top_desc && (
        <div className="mb-3 p-5 border rounded-md">
          <h4 className="underline mb-3 underline-offset-4">Top Description</h4>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: top_desc }}
          />
        </div>
      )}
      {bottom_desc && (
        <div className="p-5 border rounded-md">
          <h4 className="underline mb-3 underline-offset-4">
            Bottom Description
          </h4>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: bottom_desc }}
          />
        </div>
      )}
    </div>
  ) : null;
}

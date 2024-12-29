// ... in your table columns definition
{
  header: "Image",
  cell: ({ row }) => (
    row.original.imageUrl ? (
      <a 
        href={row.original.imageUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        View Image
      </a>
    ) : "No image"
  )
},
{
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex gap-2">
      <IconButton
        variant="text"
        color="blue"
        onClick={() => handleEdit(row.original)}
      >
        <PencilIcon className="h-4 w-4" />
      </IconButton>
      <IconButton
        variant="text"
        color="red"
        onClick={() => handleDelete(row.original.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </IconButton>
    </div>
  )
}
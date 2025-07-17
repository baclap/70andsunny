import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'comingSoonMessage',
      title: 'Coming Soon Message',
      type: 'string',
      description: 'Message to display on the coming soon page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expectedOpenDate',
      title: 'Expected Open Date',
      type: 'date',
      description: 'When do you expect to open? (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'comingSoonMessage',
    },
  },
})

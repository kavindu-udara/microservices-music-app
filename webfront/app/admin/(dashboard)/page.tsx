import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

const tableHeadings = [
  {
    name: 'Icon',
    className: 'w-[100px]'
  },
  {
    name: 'Name',
    className: ''
  },
  {
    name: 'Bio',
    className: ''
  },
  {
    name: 'Country Code',
    className: 'text-right'
  }
];

const AdminPage = () => {

  const fetchData = async () => {
    
  }

  return (
    <div className='p-5 flex flex-col gap-5'>
      <div className='flex justify-end'>
        <Button> <PlusIcon/> Add New Artist</Button>
      </div>
      {/* table */}
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            {
              tableHeadings.map((heading) => (
                <TableHead key={heading.name} className={heading.className}>{heading.name}</TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminPage

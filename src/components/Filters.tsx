import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { botsManagementRows } from '@/data/data'
import { Column, Table } from '@tanstack/react-table'
import { Filter, GripVertical, Search, Settings2, Square, SquareCheck, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import Combobox from "./Combobox"

const status = Array.from(new Set(botsManagementRows.map((data) => data.status))).map(status => ({ value: status, label: status }));
const categories = Array.from(new Set(botsManagementRows.map((data) => data.category))).map(category => ({ value: category, label: category }));

const Filters = ({ table }: { table: Table<any> }) => {
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);
    const [columns, setColumns] = useState<Column<any, unknown>[]>(table.getAllColumns());
    const appliedFilters = useMemo(() => {
        return [...statusFilter, ...categoriesFilter].map((filter) => ({ filter: filter, group: statusFilter.includes(filter) ? 'status' : 'category' }));
    }, [statusFilter, categoriesFilter])

    const handleRemoveFilter = (filter?: Record<string, any>) => {
        if (filter?.filter && filter?.group === 'status') {
            const filters = statusFilter.filter(status => status !== filter?.filter);
            setStatusFilter(filters);
        }
        else if (filter?.filter && filter?.group === 'category') {
            const categories = categoriesFilter.filter(status => status !== filter?.filter);
            setCategoriesFilter(categories);
        }
        else {
            setStatusFilter([]);
            setCategoriesFilter([]);
        }
    }

    function moveColumn(columns: Column<any, unknown>[], dragData: DropResult) {
        if (dragData?.destination?.index === 0) return columns;

        const dragIndex = columns.findIndex((col: any) => col.id === dragData.draggableId);

        if (dragIndex !== -1) {
            const [removedColumn] = columns.splice(dragIndex, 1);

            const insertIndex = dragData?.destination?.index || dragIndex;
            columns.splice(insertIndex, 0, removedColumn);
        }

        return columns;
    }

    const handleDragEnd = (result: DropResult) => {
        const newOrder = moveColumn(columns, result) as Column<any, unknown>[];
        setColumns(newOrder);
        table.setColumnOrder(newOrder.map((col) => col.id));
    }

    useEffect(() => {
        table.getColumn('status')?.setFilterValue(statusFilter);
    }, [statusFilter]);
    useEffect(() => {
        table.getColumn('category')?.setFilterValue(categoriesFilter);
    }, [categoriesFilter]);

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                <div>
                    <Button variant="outline" size="sm" disabled={true} className="disabled:opacity-100" >All bots ({table.getRowCount()})</Button>
                </div>
                <div className="flex flex-row justify-between items-center gap-4">
                    <Sheet>
                        <SheetTrigger className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground flex justify-between items-center gap-2 h-10 px-3">
                            <Filter size={16} /> Filter
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter your bots</SheetTitle>
                                <SheetDescription className="flex flex-col justify-center items-start gap-4">
                                    <Combobox title='Status' options={status} isMultiSelect={true} handleValueChange={setStatusFilter} selectedValue={statusFilter} />
                                    <Combobox title='Category' options={categories} isMultiSelect={true} handleValueChange={setCategoriesFilter} selectedValue={categoriesFilter} />
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>

                    <Sheet>
                        <SheetTrigger className="whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground flex justify-between items-center gap-2 h-10 px-3">
                            <Settings2 size={16} />
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Customize Columns</SheetTitle>
                                <SheetDescription>Select which column to show or drag them into a different order</SheetDescription>
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="columns">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {
                                                    columns.map((col, i) => {
                                                        const isVisible = col.getIsVisible();
                                                        const colId = col.id;
                                                        const colName = col.id.replace('_', ' ');
                                                        return (
                                                            <Draggable
                                                                key={colId}
                                                                draggableId={colId}
                                                                index={i}
                                                            >
                                                                {(provided, dragSnapshot) => (
                                                                    <div
                                                                        className={`flex justify-start items-center gap-2 capitalize py-3 px-2 border-l-4 ${isVisible ? 'border-blue-900' : 'border-white'} ${dragSnapshot.isDragging || colId === 'name' ? 'opacity-50' : ''} ${colId === 'name' ? 'cursor-not-allowed pointer-events-none' : ''}`}
                                                                        onClick={() => colId !== 'name' ? table?.getColumn(colId)?.toggleVisibility() : undefined}
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <GripVertical size={20} /> <span className="cursor-pointer flex justify-start items-center gap-2">{isVisible ? <SquareCheck size={18} /> : <Square size={18} />} {colName}</span>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        )
                                                    })
                                                }
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>

                    <div className="relative ml-auto flex-1 md:grow-0">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search a bot"
                            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            onChange={(event) =>
                                table.getColumn("name")?.setFilterValue(event.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-start items-center gap-4 flex-wrap'>
                {
                    appliedFilters.length > 0 && (
                        appliedFilters.map(filter => (
                            <Badge className='px-4 py-2 cursor-pointer space-x-2 capitalize' variant="secondary" onClick={() => handleRemoveFilter(filter)}>
                                <p>{filter.group}: {filter.filter}</p> <X size={15} />
                            </Badge>
                        ))
                    )
                }
                {
                    appliedFilters.length > 0 && (<Badge className='px-4 py-2 cursor-pointer capitalize' variant="secondary" onClick={() => handleRemoveFilter()}>Clear All</Badge>)
                }
            </div>
        </>
    )
}

export default Filters
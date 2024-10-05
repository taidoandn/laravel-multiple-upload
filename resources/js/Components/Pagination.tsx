import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/Components/ui/pagination';
import { cn } from '@/lib/utils';
import type { Link as TLink } from '@/types/pagination';

interface Props {
  links: TLink[];
}

const Pagination = ({ links }: Props) => {
  if (links.length === 0) {
    return null;
  }
  return (
    <>
      <BasePagination className="mt-6">
        <PaginationContent className={cn('flex-wrap')}>
          {links.map((link) => {
            return (
              <PaginationItem key={link.label}>
                <PaginationLink
                  size="default"
                  isActive={link.active}
                  key={link.label}
                  href={link.url || ''}
                  disabled={!link.url}
                  className={cn({ 'pointer-events-none opacity-50': !link.url })}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                ></PaginationLink>
              </PaginationItem>
            );
          })}
        </PaginationContent>
      </BasePagination>
    </>
  );
};

export default Pagination;

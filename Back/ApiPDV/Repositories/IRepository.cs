﻿using ApiPDV.Pagination;
using System.Linq.Expressions;

namespace ApiPDV.Repositories
{
    public interface IRepository<T>
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<PagedList<T>> GetPagedAsync<TKey>(Expression<Func<T, bool>>? predicate, Expression<Func<T, TKey>>? orderPredicate, int pageNumber, int pageSize);
        Task<T> GetAsync(Expression<Func<T, bool>> predicate);
        T Create(T entity);
        T Update(T entity);
        T Delete(T entity);
    }
}
